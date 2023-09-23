import React from 'react'

import { MaxLengthSelector } from "./maxlength-selector"
import { ModelSelector } from "./model-selector"
import { TemperatureSelector } from "./temperature-selector"
import { TopPSelector } from "./top-p-selector"
import { models, types } from "../data/models"

export default function Aside() {
  return (
    <div className="hidden flex-col space-y-4 sm:flex md:order-2">
      <ModelSelector types={types} models={models} />
      <TemperatureSelector defaultValue={[0.56]} />
      <MaxLengthSelector defaultValue={[256]} />
      <TopPSelector defaultValue={[0.9]} />
    </div>
  )
}
