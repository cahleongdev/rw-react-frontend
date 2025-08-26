import { waveform, bouncy, ring } from 'ldrs';

// Register the waveform custom element
waveform.register();
bouncy.register();
ring.register();
const PageLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="flex items-center justify-center">
        <l-waveform size="45" stroke="4" speed="1" color="#F97316"></l-waveform>
      </div>
    </div>
  );
};

const DataLoading: React.FC = () => {
  return (
    <div className="flex grow items-center justify-center">
      <l-bouncy size="45" speed="1.75" color="#F97316"></l-bouncy>
    </div>
  );
};

const CircleLoading: React.FC = () => {
  return (
    <div className="flex grow items-center justify-center">
      <l-ring size="45" speed="1.75" color="#F97316"></l-ring>
    </div>
  );
};

export { PageLoading as Loading, DataLoading, CircleLoading };
