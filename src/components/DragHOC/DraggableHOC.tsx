import { ReactNode } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { MdDragIndicator } from 'react-icons/md';

const DragWrapper = styled.div<{ $isDragging: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;

  & >:first-child {
    margin-right: 0.2em;
  }

  border: ${props => props.$isDragging && '1px solid red'};
`;

interface DraggableHOCProps {
  children: ReactNode;
  draggableId: string;
  index: number;
  key: string;
}

export const DraggableHOC: React.FC<DraggableHOCProps> = ({
  children,
  draggableId,
  index,
}) => {
  return (
    <Draggable
      draggableId={draggableId}
      index={index}
    >
      {(provided, snapshot) => (
        <DragWrapper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          $isDragging={snapshot.isDragging}
        >
          <MdDragIndicator />

          {children}
        </DragWrapper>
      )}
    </Draggable>
  );
};
