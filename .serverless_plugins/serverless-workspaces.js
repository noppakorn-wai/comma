const { writeFileSync } = require('fs')
const { resolve } = require('path')
const { dump } = require('js-yaml')
const { defaultTo, forIn, get, isUndefined, mapValues, omit, omitBy } = require('lodash')

const isNotUndefined = (val) => !isUndefined(val)

const MODE = {
  DEV: 'development',
  WORKSPACE: 'workspace',
  ROOT: 'root',
}

class ServerlessWorkspaces {
  constructor(serverless, options) {
    this.options = options
    this.provider = serverless.getProvider('aws')
    this.serverless = serverless
    this.service = serverless.service
    const populateService = serverless.variables.populateService.bind(serverless.variables)
    // eslint-disable-next-line no-param-reassign
    serverless.variables.populateService = async () => {
      this.service = await populateService(options)
      if (serverless.processedInput.commands[0] === 'offline') {
        this.switchWorkspace(MODE.DEV)
      } else {
        const mode = options.workspace ? MODE.WORKSPACE : MODE.ROOT
        this.switchWorkspace(mode)
      }
      return this.service
    }
    this.hooks = {
      'before:package:compileFunctions': () => {
        const workspacePath = this.workspacePath
        if (!workspacePath) return
        this.serverless.service.functions = mapValues(this.serverless.service.functions, (fn) => ({
          ...fn,
          package: {
            ...fn.package,
            artifact: [workspacePath, fn.package.artifact].join('/'),
          },
        }))
      },
    }
  }

  switchWorkspace(mode = MODE.ROOT) {
    this.mode = mode
    this.serverless.cli.log('Setting workspaces...')
    const service = this.service
    const options = this.options
    const workspaces = get(service, 'custom.workspaces', {})
    service.functions = defaultTo(service.functions, {})
    service.resources = defaultTo(service.resources, {})
    switch (mode) {
      case MODE.DEV: {
        if (options.service)
          throw new Error('could not run serverless-offline with --workspace option')
        forIn(workspaces, (workspace) => {
          const workspaceName = get(workspace, 'service.name')
          if (!workspace) throw new Error(`workspace named ${workspaceName} didn't configured`)
          service.custom = Object.assign({}, service.custom, workspace.custom)
          forIn(workspace.functions, (functionObject, functionName) => {
            const globalFunctionName = `${workspaceName}-${functionName}`
            service.functions[globalFunctionName] = functionObject
          })
          service.resources.Resources = Object.assign(
            {},
            get(service, 'resources.Resources'),
            get(workspace, 'resources.Resources'),
          )
          service.resources.Outputs = Object.assign(
            {},
            get(service, 'resources.Outputs'),
            get(workspace, 'resources.Outputs'),
          )
        })
        service.setFunctionNames(this.provider)
        break
      }
      case MODE.WORKSPACE: {
        const workspaceName = options.workspace
        if (!workspaceName) throw new Error('missing workspace name')
        const workspace = get(workspaces, [workspaceName, 'service'])
        const workspacePath = get(workspaces, [workspaceName, 'path'])
        if (!workspace) throw new Error('no workspace named:', workspaceName)
        const serviceName = [service.service, workspaceName].join('-')
        const slsConfig = {
          ...workspace.service,
          name: serviceName,
          plugins: get(service, 'plugins', [])
            .concat(workspace.plugins)
            .filter(isNotUndefined)
            .filter((name) => name !== 'serverless-workspaces'),
          provider: Object.assign({}, service.provider, workspace.provider),
          package: omitBy(Object.assign({}, service.package, workspace.package), isUndefined),
          custom: omitBy(
            omit(Object.assign({}, service.custom, workspace.custom), ['workspaces']),
            isUndefined,
          ),
          functions: mapValues(Object.assign({}, workspace.functions), ({ handler, ...other }) => ({
            handler: handler.replace(workspacePath, '.'),
            ...other,
          })),
        }
        writeFileSync([workspacePath, 'serverless.yml'].join('/'), dump(slsConfig))
        this.serverless.service = Object.assign(this.serverless.service, slsConfig)
        this.serverless.service.service = serviceName
        this.serverless.service.serviceObject = {
          ...this.serverless.service.service.serviceObject,
          name: serviceName,
        }
        this.serverless.config.servicePath = resolve(
          service.serverless.config.servicePath,
          workspacePath,
        )
        service.setFunctionNames(this.provider)
        this.workspacePath = workspacePath
        break
      }
      case MODE.ROOT:
      default:
        break
    }
  }
}

module.exports = ServerlessWorkspaces
