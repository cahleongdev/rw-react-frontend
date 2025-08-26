import React, { useEffect, useState } from 'react';

import CustomFieldsSectionContainer from '../CustomFieldsSection';
import { DataLoading } from '@/components/base/Loading';

import { IBoardMemberDetail } from '@/store/slices/schoolSlice';

import BoardMembersAPI from '@/api/boardMembers';
import { EntityType } from '../index.types';

interface BoardMemberDetailTabProps {
  entityId: string;
  onAddFieldClick: (open: boolean) => void;
}

const BoardMemberDetailTab: React.FC<BoardMemberDetailTabProps> = ({
  entityId,
  onAddFieldClick,
}) => {
  const [boardMember, setBoardMember] = useState<IBoardMemberDetail | null>(
    null,
  );

  useEffect(() => {
    if (!entityId) return;
    const fetchBoardMember = async () => {
      const boardMember = await BoardMembersAPI.getBoardMemberDetail(entityId);
      setBoardMember(boardMember);
    };
    fetchBoardMember();
  }, [entityId]);

  if (!boardMember) return <DataLoading />;

  return (
    <div className="flex flex-col gap-4 p-6 border-t-2 border-slate-200 overflow-y-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 border-b border-slate-200 pb-2">
          <span className="body2-bold w-[150px]">Email</span>
          <span className="body2-medium">{boardMember.email ?? '-'}</span>
        </div>
        <div className="flex flex-row gap-2 border-b border-slate-200 pb-2">
          <span className="body2-bold w-[150px]">Phone</span>
          <span className="body2-medium">{boardMember.phone ?? '-'}</span>
        </div>
        <div className="flex flex-row gap-2 border-b border-slate-200 pb-2">
          <span className="body2-bold w-[150px]">Title</span>
          <span className="body2-medium">{boardMember.title ?? '-'}</span>
        </div>
        <div className="flex flex-row gap-2 border-b border-slate-200 pb-2">
          <span className="body2-bold w-[150px]">Start Term</span>
          <span className="body2-medium">{boardMember.start_term ?? '-'}</span>
        </div>
        <div className="flex flex-row gap-2 border-b border-slate-200 pb-2">
          <span className="body2-bold w-[150px]">End Term</span>
          <span className="body2-medium">{boardMember.end_term ?? '-'}</span>
        </div>
      </div>

      <CustomFieldsSectionContainer
        entityId={entityId}
        entityType={EntityType.BoardMember}
        onAddFieldClick={onAddFieldClick}
      />
    </div>
  );
};

export default BoardMemberDetailTab;
