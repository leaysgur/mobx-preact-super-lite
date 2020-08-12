import { spy } from "mobx"
import { useState } from "preact/hooks"

if (!useState) {
    throw new Error("mobx-preact-super-lite requires Preact with Hooks support")
}
if (!spy) {
    throw new Error("mobx-react-lite requires MobX at least version 4 to be available")
}
