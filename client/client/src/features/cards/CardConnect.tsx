// Component for card connection flow
import { useState } from 'react';
import { CardForm } from './CardForm';

// Card connection component
export function CardConnect() {
  // State for current step (select, card, verify)
  const [step, setStep] = useState<'select' | 'card' | 'verify'>('select');
  // State for added card ID
  const [cardId, setCardId] = useState<string | null>(null);

  return (
    // Container for card connection
    <div className="max-w-md mx-auto p-4">
      {/* Step 1: Select method */}
      {step === 'select' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add a Bank Card</h3>
          {/* Manual entry button */}
          <button
            onClick={() => setStep('card')}
            className="w-full flex items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="w-10 h-10 mr-3 bg-gray-200 rounded-full" />
            <span>Manual Card Entry</span>
          </button>
          <p className="text-sm text-gray-500">
            Enter card details to track transactions.
          </p>
        </div>
      )}
      {/* Step 2: Card form */}
      {step === 'card' && (
        <CardForm
          onSuccess={(newCardId) => {
            setCardId(newCardId);
            setStep('verify');
          }}
        />
      )}
      {/* Step 3: Confirmation */}
      {step === 'verify' && cardId && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Card Added</h3>
          <p className="text-gray-600">
            Your card ending in {cardId.slice(-4)} has been added.
          </p>
          {/* Done button */}
          <button
            onClick={() => setStep('select')}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}