import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'

import { useDispatch } from '@xrengine/client-core/src/store'
import {
  initialize3D,
  onWindowResize,
  renderScene
} from '@xrengine/client-core/src/user/components/UserMenu/menus/helperFunctions'
import { loadAvatarModelAsset } from '@xrengine/engine/src/avatar/functions/avatarFunctions'
import { getOrbitControls } from '@xrengine/engine/src/input/functions/loadOrbitControl'

import CircularProgress from '@mui/material/CircularProgress'

import { EditorAction, useEditorState } from '../../../services/EditorServices'
import { useModeState } from '../../../services/ModeServices'
import styles from '../styles.module.scss'

/**
 * @author Abhishek Pathak
 */

const ModelPreview = (styled as any).canvas`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: 100%;
  position: relative;
`

/**
 * @author Abhishek Pathak <abhi.pathak401@gmail.com>
 * @param props
 * @returns
 */

export let camera: PerspectiveCamera
export let scene: Scene
export let renderer: WebGLRenderer = null!

export const ModelPreviewPanel = (props) => {
  const modeState = useModeState()
  const dispatch = useDispatch()
  const url = props.resourceProps.resourceUrl
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadModel = async () => {
    try {
      const model = await loadAvatarModelAsset(url)
      model.name = 'avatar'
      const result = scene.getObjectByName(model.name)
      if (result) scene.remove(result)
      scene.add(model)
      setLoading(false)
      renderScene({ scene, camera, renderer })
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }

  if (renderer) loadModel()

  useEffect(() => {
    const init = initialize3D()
    scene = init.scene
    camera = init.camera
    renderer = init.renderer
    const controls = getOrbitControls(camera, renderer.domElement)
    ;(controls as any).addEventListener('change', () => renderScene({ scene, camera, renderer }))

    controls.minDistance = 0.1
    controls.maxDistance = 10
    controls.target.set(0, 1.25, 0)
    controls.update()
    if (loading) loadModel()

    window.addEventListener('resize', () => onWindowResize({ scene, camera, renderer }))

    return () => {
      window.removeEventListener('resize', () => onWindowResize({ scene, camera, renderer }))
    }
  }, [])

  return (
    <>
      {loading && (
        <div className={styles.container}>
          <CircularProgress />
        </div>
      )}
      {error && (
        <div className={styles.container}>
          <h1 className={styles.error}>{error}</h1>
        </div>
      )}
      <div id="stage" style={{ width: '100%', height: '100%' }}></div>
    </>
  )
}
