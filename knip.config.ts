import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['app/thoughts/_articles/*.mdx'],
  ignoreDependencies: ['sharp'],
}

export default config
