import react from '@vitejs/plugin-react';
import * as path from 'path';
import dts from 'vite-plugin-dts';
import { UserConfigExport, defineConfig } from 'vite';
import { name } from './package.json';

const app = async (): Promise<UserConfigExport> => {
    /**
     * Removes everything before the last
     * @octocat/library-repo -> library-repo
     * vite-component-library-template -> vite-component-library-template
     */
    const formattedName = name.match(/[^/]+$/)?.[0] ?? name;

    return defineConfig({
        plugins: [
            react(),
            dts({
                insertTypesEntry: true
            })
        ],
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/lib/index.ts'),
                name: formattedName,
                formats: ['es', 'umd'],
                fileName: format => `${formattedName}.${format}.js`
            },
            rollupOptions: {
                external: ['react', 'react/jsx-runtime', 'react-dom', 'tailwindcss'],
                output: {
                    globals: {
                        react: 'React',
                        'react/jsx-runtime': 'react/jsx-runtime',
                        'react-dom': 'ReactDOM',
                        tailwindcss: 'tailwindcss'
                    }
                }
            }
        }
    });
};
// https://vitejs.dev/config/
export default app;
