import { themeChange } from 'theme-change'
import {useEffect } from "react";

export const useChangeTheme = () => {
useEffect(() => {
  themeChange(false)
  // 👆 false parameter is required for react project
}, []);}

