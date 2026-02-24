import { useEffect } from 'preact/hooks';
import { navigate } from '../lib/navigate';
import { MovementCounter } from '../components/movement/MovementCounter';
import { isTracking, startSession } from '../stores/movementStore';
import { PageLayout } from '../components/layout/PageLayout';

export function MovementCount() {
  const tracking = isTracking.value;

  useEffect(() => {
    if (!tracking) {
      startSession();
    }
  }, []);

  const handleBack = () => {
    navigate('/movement');
  };

  return (
    <PageLayout onBack={handleBack}>
      <div className="max-w-2xl mx-auto pb-24">
        <MovementCounter />
      </div>
    </PageLayout>
  );
}
