import VaultUnwrapper from './components/VaultUnwrapper';
import ConnectButton from './components/ConnectButton';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Infrared Boyco Vault Unwrapper</h1>
        
        <p className="text-gray-400 max-w-2xl mx-auto">
          Enter your WIV (Wrapped Infrared Vault) address and unwrap it to claim your underlying assets.
        </p>
      </div>
      
      <div className="mb-6">
        <ConnectButton />
      </div>
      
      <VaultUnwrapper />
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Open source tool for the Berachain community</p>
        <p className="my-2 text-lg">Made with ❤️ by <a href="https://github.com/mystic-mango" target="_blank" rel="noopener noreferrer">Mystic Mango</a></p>
      </footer>
    </main>
  );
}
