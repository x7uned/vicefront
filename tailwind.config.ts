import type { Config } from 'tailwindcss'

const config: Config = {
	darkMode: 'class',
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'custom-gradient':
					'linear-gradient(0deg, rgba(40,44,52,1) 0%, #2d2d2d 100%)',
			},
			colors: {
				backgroundColor: 'var(--background-color)',
				cartColor: 'var(--cart-color)',
				textColor: 'var(--text-color)',
				textFooterColor: 'var(--text-footer-color)',
				borderColor: 'var(--border-color)',
				horizontalLineColor: 'var(--horizonalLine-color)',
				fillButtonColor: 'var(--fill-button-color)',
				fillTextColor: 'var(--fill-text-color)',
				searchbarColor: 'var(--searchbar-color)',
				searchbarText: 'var(--searchbar-text)',
				gold: 'var(--gold)',
				footerBg: 'var(--footer-bg)',
				selectionColor: 'var(--selection-color)',
				inputColor: 'var(--input-color)',
			},
		},
	},
	plugins: [],
}

export default config
