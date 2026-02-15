/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.03)',
            }
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}
