import { URL } from 'url'

export const isValidURL = (input: unknown): input is string => {
   if (typeof input === 'string') {
      try {
         // eslint-disable-next-line no-new
         new URL(input)
         return true
      } catch (e) {
         return false
      }
   }

   return false
}
