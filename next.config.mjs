/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        },
    },
    async rewrites() {
        return [
            {
                source: '/api/v1/categories',
                destination: '/api/v1/general/categories',
            },
            {
                source: '/api/stats',
                destination: '/api/v1/general/stats',
            },
            {
                source: '/api/v1/onboarding',
                destination: '/api/v1/general/onboarding',
            },
            {
                source: '/api/v1/saved-pros',
                destination: '/api/v1/general/saved-pros',
            },
        ];
    },
};

export default nextConfig;
