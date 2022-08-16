import {atom} from "recoil"

export const modalState = atom({
  key: 'textState', 
  default: false
})

export const postIdState = atom({
  key: 'postIdState',
  default: 'id'
})