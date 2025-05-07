> **Note:** This tool was developed rapidly to assist users with unwrapping their Boyco vaults and should not be considered a reflection of production quality or design capabilities.

# Infrared Vault Unwrapper

A simple, open-source tool for the Berachain community to unwrap their positions from Boyco yield opportunities.

## Purpose

This tool was created to help users who deposited into wrapped Infrared vaults (WIV) through Boyco yield opportunities. When withdrawals were unlocked, users found themselves needing to make direct contract calls to unwrap their positions, which was not user-friendly for many.

This tool provides a simple web interface that allows users to:
1. Connect their wallet
2. Select their WIV position
3. Unwrap their tokens with a single click

## Features

- Simple, user-friendly interface
- Support for multiple WIV contracts
- Automatic network switching to Berachain
- Direct contract interaction without manual calls
- Transaction confirmation and explorer links

## Getting Started

### Using the Live Version

The easiest way to use this tool is to visit the live deployment:
[https://infrared-unwrap.vercel.app](https://infrared-unwrap.vercel.app)

### Running Locally

If you prefer to run the tool locally:

1. Clone the repository:
```bash
git clone https://github.com/yourusername/infrared-unwrap.git
cd infrared-unwrap
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to use the tool.

## Technical Details

This is a [Next.js](https://nextjs.org) project that uses:
- Wagmi for blockchain interactions
- Tailwind CSS for styling
- TypeScript for type safety

## Contributing

This is an open-source project. Feel free to:
- Report issues
- Suggest improvements
- Submit pull requests

## License

Open source - feel free to use and modify as needed.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
