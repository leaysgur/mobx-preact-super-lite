import { makeObservable } from "mobx";
import { useState } from "preact/hooks";

if (!useState)
  throw new Error("mobx-preact-super-lite requires Preact with Hooks support");

if (!makeObservable)
  throw new Error(
    "mobx-preact-super-lite@3 requires MobX at least version 6 to be available"
  );
