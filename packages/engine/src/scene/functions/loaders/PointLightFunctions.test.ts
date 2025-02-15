import assert from 'assert'
import { Color, PointLight } from 'three'

import { ComponentJson } from '@xrengine/common/src/interfaces/SceneInterface'

import { Engine } from '../../../ecs/classes/Engine'
import { createWorld } from '../../../ecs/classes/World'
import { getComponent, hasComponent } from '../../../ecs/functions/ComponentFunctions'
import { createEntity } from '../../../ecs/functions/EntityFunctions'
import { Object3DComponent } from '../../components/Object3DComponent'
import { deserializePointLight } from './PointLightFunctions'

describe('PointLightFunctions', () => {
  it('deserializePointLight', () => {
    const world = createWorld()
    Engine.currentWorld = world

    const entity = createEntity()
    const color = new Color('pink')
    const sceneComponentData = {
      color: color.clone(),
      intensity: 5
    }
    const sceneComponent: ComponentJson = {
      name: 'point-light',
      props: sceneComponentData
    }

    deserializePointLight(entity, sceneComponent)

    assert(hasComponent(entity, Object3DComponent))
    assert(getComponent(entity, Object3DComponent).value instanceof PointLight)
    assert((getComponent(entity, Object3DComponent).value as PointLight).color instanceof Color)
    assert.deepEqual((getComponent(entity, Object3DComponent).value as PointLight).color.toArray(), color.toArray())
    assert.deepEqual((getComponent(entity, Object3DComponent).value as PointLight).intensity, 5)
  })
})
