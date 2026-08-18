declare module "gray-matter" {
  export interface GrayMatterResult<T = Record<string, unknown>> {
    data: T;
    content: string;
  }
  export default function matter<T = Record<string, unknown>>(input: string): GrayMatterResult<T>;
}
