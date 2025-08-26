import { useState } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { Button } from '@components/base/Button';

import TransparencyDetailsContainer from './Details';
import TransparencySchoolsContainer from './Schools';
import TransparencyDocumentsContainer from './Documents';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';

const tabLabels = [
  { id: 'Details', label: 'Details' },
  { id: 'Schools', label: 'Schools' },
  { id: 'Documents', label: 'Documents' },
];

const Transparency = () => {
  const [activeFilter, setActiveFilter] = useState(tabLabels[0].id);
  const user = useSelector((state: RootState) => state.auth.user);

  const agency_id = user?.agency;

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center py-4 px-6 border-b-[1px] border-beige-300 bg-beige-100 flex-shrink-0 gap-4">
        <h3 className="text-slate-900 font-semibold">Transparency</h3>
        <div className="flex flex-1">
          {tabLabels.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                px-4 py-2 
                rounded-[5px]
                text-sm font-medium
                transition-colors
                ${
                  activeFilter === filter.id
                    ? 'bg-blue-50 text-blue-500 hover:bg-blue-50'
                    : 'bg-transparent text-slate-500 hover:bg-neutral-100'
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <Link to={`/transparency/${agency_id}/`} target="_blank">
          <Button className="cursor-pointer bg-blue-500 rounded-[6px] hover:bg-blue-600 h-[36px] px-3 py-2">
            <span className="text-white text-sm font-medium">Preview Site</span>
            <ArrowTopRightOnSquareIcon className="size-4" />
          </Button>
        </Link>
      </div>
      {activeFilter === 'Details' && <TransparencyDetailsContainer />}
      {activeFilter === 'Schools' && <TransparencySchoolsContainer />}
      {activeFilter === 'Documents' && <TransparencyDocumentsContainer />}
    </div>
  );
};

export default Transparency;
