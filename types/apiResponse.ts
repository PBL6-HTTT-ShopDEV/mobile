import { TStatusVariant } from './common'

export interface IApiResponse<T> {
  status: TStatusVariant
  data?: Partial<T>
  message: string
}
