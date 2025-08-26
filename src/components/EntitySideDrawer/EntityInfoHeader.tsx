import React from 'react';
import { SquaresPlusIcon, PencilIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/base/Button';
import { SchoolUser, BoardMemberBase } from '@/store/slices/schoolUsersSlice';

import { SchoolBaseEntity } from '@/store/slices/schoolsSlice';
import { EntityType } from '@/containers/EntitySideDrawer/index.types';

type EntityInfoHeaderProps =
  | {
      entityType: EntityType.SchoolUser | EntityType.AgencyUser;
      entity: SchoolUser;
      onEditEntity: () => void;
      onManageCustomFields: () => void;
    }
  | {
      entityType: EntityType.Network | EntityType.School;
      entity: SchoolBaseEntity;
      onEditEntity: () => void;
      onManageCustomFields: () => void;
    }
  | {
      entityType: EntityType.BoardMember;
      entity: BoardMemberBase;
      onEditEntity: () => void;
      onManageCustomFields: () => void;
    };

export const EntityInfoHeader: React.FC<EntityInfoHeaderProps> = ({
  entity,
  entityType,
  onEditEntity,
  onManageCustomFields,
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {entityType === EntityType.SchoolUser ||
        entityType === EntityType.BoardMember ||
        entityType === EntityType.AgencyUser ? (
          entityType !== EntityType.BoardMember ? (
            <>
              <div className="flex-shrink-0 w-[72px] h-[72px] bg-orange-100 rounded-sm flex items-center justify-center border border-orange-300">
                {entity.profile_image ? (
                  <img
                    src={entity.profile_image}
                    alt=""
                    className="w-full h-full object-cover rounded-sm"
                  />
                ) : (
                  <span className="text-2xl uppercase font-semibold text-orange-600">
                    {entity.first_name?.[0].toUpperCase()}
                    {entity.last_name?.[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-lg font-semibold">
                  {entity.first_name} {entity.last_name}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="body2-regular text-slate-800">
                    {entity.email} | {entity.phone_number || '-'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${entity.is_active ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    ></div>
                    <span className="body2-regular text-slate-500">
                      {entity.is_active ? 'Active' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border border-orange-300">
                <span className="body3-regular uppercase text-orange-600">
                  {entity.first_name?.[0].toUpperCase()}
                  {entity.last_name?.[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-lg font-semibold">
                  {entity.first_name} {entity.last_name}
                </span>
              </div>
            </>
          )
        ) : entityType === EntityType.Network ||
          entityType === EntityType.School ? (
          <>
            <div className="flex-shrink-0 w-[72px] h-[72px] bg-orange-100 rounded-sm flex items-center justify-center border border-orange-300">
              {entity.profile_image ? (
                <img
                  src={entity.profile_image}
                  alt=""
                  className="w-full h-full object-cover rounded-sm"
                />
              ) : (
                <span className="text-2xl uppercase font-semibold text-orange-600">
                  {entity.name
                    .split(' ')
                    .slice(0, 2)
                    .map((name) => name[0].toUpperCase())
                    .join('')}
                </span>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-lg font-semibold">{entity.name}</span>
              <div className="flex flex-col gap-1">
                <span className="body2-regular text-slate-800">
                  {entity.address}
                </span>
                <span className="body2-regular text-slate-800">
                  {entity.city}, {entity.state} {entity.zipcode}
                </span>
              </div>
            </div>
          </>
        ) : null}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border border-slate-700 rounded-md"
            onClick={onManageCustomFields}
          >
            <SquaresPlusIcon className="w-[18px] h-[18px] text-slate-700" />
          </Button>
          <Button
            variant="outline"
            className="border border-slate-700 rounded-md"
            onClick={onEditEntity}
          >
            <PencilIcon className="w-[18px] h-[18px] text-slate-700" />
          </Button>
        </div>
      </div>
    </>
  );
};
