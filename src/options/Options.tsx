import React, { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove } from '@dnd-kit/sortable';
import type { Template, Group } from '../types/index';
import {
  loadStoredData,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  addGroup,
  updateGroup,
  deleteGroup,
  reorderTemplates,
  moveTemplateToGroup,
} from '../utils/storage';
import './Options.css';

// ============== Icons ==============
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

// ============== Drag Handle (6 dots) ==============
interface DragHandleProps {
  listeners?: React.HTMLAttributes<HTMLElement>;
  attributes?: React.HTMLAttributes<HTMLElement>;
}

const DragHandle: React.FC<DragHandleProps> = ({ listeners, attributes }) => (
  <div className="drag-handle" {...listeners} {...attributes}>
    <div className="drag-handle-dots">
      <span className="drag-handle-dot" />
      <span className="drag-handle-dot" />
    </div>
    <div className="drag-handle-dots">
      <span className="drag-handle-dot" />
      <span className="drag-handle-dot" />
    </div>
    <div className="drag-handle-dots">
      <span className="drag-handle-dot" />
      <span className="drag-handle-dot" />
    </div>
  </div>
);

// ============== Template Modal ==============
interface TemplateModalProps {
  template: Template | null;
  groupId: number | null;
  onSave: (template: Partial<Template> & { groupId: number }) => void;
  onClose: () => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  template,
  groupId,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(template?.name || '');
  const [content, setContent] = useState(template?.content || '');
  const [showError, setShowError] = useState(false);

  const isNameEmpty = !name.trim();

  const handleSave = () => {
    if (isNameEmpty) {
      setShowError(true);
      return;
    }
    onSave({
      id: template?.id,
      groupId: template?.groupId ?? groupId!,
      name: name.trim(),
      content: content,
    });
  };

  return (
    <div 
      className="modal-overlay" 
      onMouseDown={(e) => {
        // オーバーレイ自体がクリックされた場合のみ閉じる
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h2>{template ? 'テンプレートを編集' : '新しいテンプレート'}</h2>
        <div className={`modal-field ${showError && isNameEmpty ? 'error' : ''}`}>
          <label>
            テンプレート名
            <span className="required-mark">*必須</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (showError) setShowError(false);
            }}
            placeholder="テンプレート名を入力"
          />
          {showError && isNameEmpty && (
            <span className="error-message">テンプレート名は必須です</span>
          )}
        </div>
        <div className="modal-field">
          <label>内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="プロンプトの内容を入力"
          />
        </div>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>
            キャンセル
          </button>
          <button 
            className={`modal-btn save ${isNameEmpty ? 'disabled' : ''}`}
            onClick={handleSave}
            disabled={isNameEmpty}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

// ============== Template Item ==============
interface TemplateItemProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (id: number) => void;
  onNameChange: (id: number, name: string) => void;
  isDragging?: boolean;
  isDropTarget?: boolean;
  dropPosition?: 'before' | 'after';
}

const TemplateItem: React.FC<TemplateItemProps> = ({
  template,
  onEdit,
  onDelete,
  onNameChange,
  isDragging = false,
  isDropTarget = false,
  dropPosition = 'before',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(template.name);

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
  } = useDraggable({
    id: `template-${template.id}`,
    data: { template },
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: `template-${template.id}`,
    data: { template },
  });

  const setNodeRef = useCallback(
    (node: HTMLDivElement | null) => {
      setDragRef(node);
      setDropRef(node);
    },
    [setDragRef, setDropRef]
  );

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditName(template.name);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editName !== template.name) {
      onNameChange(template.id, editName.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(template.name);
    }
  };

  const isNameEmpty = !template.name.trim();
  
  const dropClass = isDropTarget
    ? dropPosition === 'before'
      ? 'drop-target-line-before'
      : 'drop-target-line-after'
    : '';

  return (
    <div 
      ref={setNodeRef}
      className={`template-wrapper ${dropClass} ${isDragging ? 'is-dragging' : ''}`}
    >
      <div className={`template-item ${isDragging ? 'dragging' : ''}`}>
        <DragHandle listeners={listeners} attributes={attributes} />
        {isEditing ? (
          <input
            type="text"
            className="template-name-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <span className="template-name" onDoubleClick={handleDoubleClick}>
            {isNameEmpty ? (
              <>
                <span className="name-required-indicator">*</span>
                <span className="name-empty">(名前なし)</span>
              </>
            ) : (
              template.name
            )}
          </span>
        )}
        <div className="template-actions">
          <button className="icon-btn" onClick={() => onEdit(template)} title="編集">
            <EditIcon />
          </button>
          <button
            className="icon-btn delete"
            onClick={() => onDelete(template.id)}
            title="削除"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============== Group Item ==============
interface GroupItemProps {
  group: Group;
  templates: Template[];
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (template: Template) => void;
  onDeleteTemplate: (id: number) => void;
  onTemplateNameChange: (id: number, name: string) => void;
  onGroupNameChange: (id: number, name: string) => void;
  onDeleteGroup: (id: number) => void;
  onAddTemplate: (groupId: number) => void;
  startEditing?: boolean;
  onEditingComplete?: () => void;
  // Drag state
  activeTemplateId?: number | null;
  overTemplateId?: number | null;
  dropPosition?: 'before' | 'after';
  isHeaderDropTarget?: boolean;
  isAddBtnDropTarget?: boolean;
  isCrossGroupDrag?: boolean;
}

const GroupItem: React.FC<GroupItemProps> = ({
  group,
  templates,
  isExpanded,
  onToggle,
  onEdit,
  onDeleteTemplate,
  onTemplateNameChange,
  onGroupNameChange,
  onDeleteGroup,
  onAddTemplate,
  startEditing = false,
  onEditingComplete,
  activeTemplateId = null,
  overTemplateId = null,
  dropPosition = 'before',
  isHeaderDropTarget = false,
  isAddBtnDropTarget = false,
  isCrossGroupDrag = false,
}) => {
  const [isEditing, setIsEditing] = useState(startEditing);
  const [editName, setEditName] = useState(group.name);

  const { setNodeRef: setHeaderDropRef } = useDroppable({
    id: `group-header-${group.id}`,
    data: { type: 'group-header', groupId: group.id },
  });

  const { setNodeRef: setAddBtnDropRef } = useDroppable({
    id: `group-add-btn-${group.id}`,
    data: { type: 'group-add-btn', groupId: group.id },
  });

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditName(group.name);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // 空の場合は元の名前に戻す
    if (!editName.trim()) {
      setEditName(group.name);
    } else if (editName.trim() !== group.name) {
      onGroupNameChange(group.id, editName.trim());
    }
    onEditingComplete?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(group.name);
      onEditingComplete?.();
    }
  };

  const sortedTemplates = [...templates].sort((a, b) => a.order - b.order);

  return (
    <div className="group-item">
      <div 
        ref={setHeaderDropRef}
        className={`group-header ${isHeaderDropTarget ? 'header-drop-target' : ''}`} 
        onClick={() => !isEditing && onToggle()}
      >
        <button className={`expand-btn ${isExpanded ? 'expanded' : ''}`}>
          <ChevronIcon />
        </button>
        {isEditing ? (
          <input
            type="text"
            className="group-name-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <span className="group-name">
            <span
              className="group-name-text"
              onDoubleClick={handleDoubleClick}
              onClick={(e) => e.stopPropagation()}
            >
              {group.name}
            </span>
          </span>
        )}
        <div className="group-header-spacer" />
        <div className="group-actions">
          <button
            className="icon-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteGroup(group.id);
            }}
            title="グループを削除"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
      {isExpanded && (
        <div 
          className={`templates-container ${isCrossGroupDrag ? 'group-drop-target' : ''}`}
        >
          {isHeaderDropTarget && (
            <div className="drop-line-top" />
          )}
          {sortedTemplates.map((template) => (
            <TemplateItem
              key={template.id}
              template={template}
              onEdit={onEdit}
              onDelete={onDeleteTemplate}
              onNameChange={onTemplateNameChange}
              isDragging={activeTemplateId === template.id}
              isDropTarget={overTemplateId === template.id}
              dropPosition={dropPosition}
            />
          ))}
          <div className="add-template-wrapper">
            {isAddBtnDropTarget && (
              <div className="drop-line-bottom" />
            )}
            <button 
              ref={setAddBtnDropRef}
              className="add-template-btn"
              onClick={() => onAddTemplate(group.id)}
            >
              <PlusIcon />
              テンプレートを追加
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============== Main Options Component ==============
const Options: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [addingToGroupId, setAddingToGroupId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);

  // Drag state
  const [activeTemplateId, setActiveTemplateId] = useState<number | null>(null);
  const [overTemplateId, setOverTemplateId] = useState<number | null>(null);
  const [overHeaderGroupId, setOverHeaderGroupId] = useState<number | null>(null);
  const [overAddBtnGroupId, setOverAddBtnGroupId] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after'>('before');

  const loadData = useCallback(async () => {
    const data = await loadStoredData();
    setGroups([...data.groups].sort((a, b) => a.order - b.order));
    setTemplates(data.templates);
    setExpandedGroups(new Set(data.groups.map((g) => g.id)));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ========== Drag Handlers ==========
  const handleDragStart = (event: import('@dnd-kit/core').DragStartEvent) => {
    const { active } = event;
    const idStr = String(active.id);
    if (idStr.startsWith('template-')) {
      const templateId = parseInt(idStr.replace('template-', ''), 10);
      setActiveTemplateId(templateId);
    }
  };

  const handleDragOver = (event: import('@dnd-kit/core').DragOverEvent) => {
    const { over, active, delta } = event;
    
    if (!over) {
      setOverTemplateId(null);
      setOverHeaderGroupId(null);
      setOverAddBtnGroupId(null);
      return;
    }

    const overIdStr = String(over.id);

    if (overIdStr.startsWith('template-')) {
      const templateId = parseInt(overIdStr.replace('template-', ''), 10);
      // 自分自身の上なら無視
      if (overIdStr === String(active.id)) {
        setOverTemplateId(null);
        return;
      }
      setOverTemplateId(templateId);
      setOverHeaderGroupId(null);
      setOverAddBtnGroupId(null);
      // ドラッグ方向で位置を決定
      setDropPosition(delta.y > 0 ? 'after' : 'before');
    } else if (overIdStr.startsWith('group-header-')) {
      const groupId = parseInt(overIdStr.replace('group-header-', ''), 10);
      setOverHeaderGroupId(groupId);
      setOverAddBtnGroupId(null);
      setOverTemplateId(null);
    } else if (overIdStr.startsWith('group-add-btn-')) {
      const groupId = parseInt(overIdStr.replace('group-add-btn-', ''), 10);
      setOverAddBtnGroupId(groupId);
      setOverHeaderGroupId(null);
      setOverTemplateId(null);
    } else {
      // 空白エリアなど
      setOverTemplateId(null);
      setOverHeaderGroupId(null);
      setOverAddBtnGroupId(null);
    }
  };

  const handleDragEnd = async (event: import('@dnd-kit/core').DragEndEvent) => {
    const { active, over } = event;

    setActiveTemplateId(null);
    setOverTemplateId(null);
    setOverHeaderGroupId(null);
    setOverAddBtnGroupId(null);

    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    if (!activeIdStr.startsWith('template-')) return;

    const activeTemplateId = parseInt(activeIdStr.replace('template-', ''), 10);
    const activeTemplate = templates.find((t) => t.id === activeTemplateId);
    if (!activeTemplate) return;

    if (overIdStr.startsWith('template-')) {
      const overTemplateId = parseInt(overIdStr.replace('template-', ''), 10);
      if (activeTemplateId === overTemplateId) return;

      const overTemplate = templates.find((t) => t.id === overTemplateId);
      if (!overTemplate) return;

      const sourceGroupId = activeTemplate.groupId;
      const targetGroupId = overTemplate.groupId;

      if (sourceGroupId === targetGroupId) {
        // 同じグループ内での移動
        const groupTemplates = templates
          .filter((t) => t.groupId === sourceGroupId)
          .sort((a, b) => a.order - b.order);

        const oldIndex = groupTemplates.findIndex((t) => t.id === activeTemplateId);
        let newIndex = groupTemplates.findIndex((t) => t.id === overTemplateId);

        if (dropPosition === 'after') {
          newIndex = newIndex + 1;
        }

        if (oldIndex !== newIndex) {
          const newOrder = arrayMove(groupTemplates, oldIndex, newIndex);
          await reorderTemplates(
            sourceGroupId,
            newOrder.map((t) => t.id)
          );
          await loadData();
        }
      } else {
        // グループ間移動
        const targetGroupTemplates = templates
          .filter((t) => t.groupId === targetGroupId)
          .sort((a, b) => a.order - b.order);

        let targetIndex = targetGroupTemplates.findIndex((t) => t.id === overTemplateId);
        if (dropPosition === 'after') {
          targetIndex = targetIndex + 1;
        }

        await moveTemplateToGroup(activeTemplateId, targetGroupId, targetIndex);
        await loadData();
      }
    } else if (overIdStr.startsWith('group-header-')) {
      // グループヘッダーにドロップ → 一番上に追加
      const targetGroupId = parseInt(overIdStr.replace('group-header-', ''), 10);
      if (activeTemplate.groupId !== targetGroupId) {
        await moveTemplateToGroup(activeTemplateId, targetGroupId, 0);
        await loadData();
      } else {
        // 同じグループ内で一番上に移動
        const groupTemplates = templates
          .filter((t) => t.groupId === targetGroupId)
          .sort((a, b) => a.order - b.order);
        const oldIndex = groupTemplates.findIndex((t) => t.id === activeTemplateId);
        if (oldIndex > 0) {
          const newOrder = arrayMove(groupTemplates, oldIndex, 0);
          await reorderTemplates(targetGroupId, newOrder.map((t) => t.id));
          await loadData();
        }
      }
    } else if (overIdStr.startsWith('group-add-btn-')) {
      // 追加ボタンにドロップ → 一番下に追加
      const targetGroupId = parseInt(overIdStr.replace('group-add-btn-', ''), 10);
      const targetGroupTemplates = templates.filter(
        (t) => t.groupId === targetGroupId
      );
      if (activeTemplate.groupId !== targetGroupId) {
        await moveTemplateToGroup(
          activeTemplateId,
          targetGroupId,
          targetGroupTemplates.length
        );
        await loadData();
      } else {
        // 同じグループ内で一番下に移動
        const groupTemplates = [...targetGroupTemplates].sort((a, b) => a.order - b.order);
        const oldIndex = groupTemplates.findIndex((t) => t.id === activeTemplateId);
        if (oldIndex < groupTemplates.length - 1) {
          const newOrder = arrayMove(groupTemplates, oldIndex, groupTemplates.length - 1);
          await reorderTemplates(targetGroupId, newOrder.map((t) => t.id));
          await loadData();
        }
      }
    }
    // 空白エリアの場合は何もしない（元の場所に戻る）
  };

  const handleDragCancel = () => {
    setActiveTemplateId(null);
    setOverTemplateId(null);
    setOverHeaderGroupId(null);
    setOverAddBtnGroupId(null);
  };

  const activeTemplate = activeTemplateId
    ? templates.find((t) => t.id === activeTemplateId)
    : null;

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ========== Group Handlers ==========
  const handleAddGroup = async () => {
    const newGroupId = await addGroup({ name: '新しいグループ' });
    await loadData();
    setEditingGroupId(newGroupId);
  };

  const handleDeleteGroup = async (id: number) => {
    if (confirm('このグループとすべてのテンプレートを削除しますか？')) {
      await deleteGroup(id);
      await loadData();
    }
  };

  const handleGroupNameChange = async (id: number, name: string) => {
    await updateGroup(id, { name });
    await loadData();
  };

  const handleToggleGroup = (groupId: number) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // ========== Template Handlers ==========
  const handleAddTemplate = (groupId: number) => {
    setAddingToGroupId(groupId);
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setAddingToGroupId(null);
    setIsModalOpen(true);
  };

  const handleDeleteTemplate = async (id: number) => {
    if (confirm('このテンプレートを削除しますか？')) {
      await deleteTemplate(id);
      await loadData();
    }
  };

  const handleTemplateNameChange = async (id: number, name: string) => {
    await updateTemplate(id, { name });
    await loadData();
  };

  const handleSaveTemplate = async (
    templateData: Partial<Template> & { groupId: number }
  ) => {
    if (templateData.id) {
      await updateTemplate(templateData.id, {
        name: templateData.name,
        content: templateData.content,
      });
    } else {
      await addTemplate({
        groupId: templateData.groupId,
        name: templateData.name || '',
        content: templateData.content || '',
      });
    }
    setIsModalOpen(false);
    setEditingTemplate(null);
    setAddingToGroupId(null);
    await loadData();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
    setAddingToGroupId(null);
  };

  // ========== Utilities ==========
  const getTemplatesForGroup = (groupId: number) =>
    templates.filter((t) => t.groupId === groupId);

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="options-container">
        <header className="options-header">
          <h1>PromptTemplate</h1>
        </header>

        <button className="add-group-btn" onClick={handleAddGroup}>
          <PlusIcon />
          グループを追加
        </button>

        {groups.length === 0 ? (
          <div className="empty-state">
            <p>まだグループがありません</p>
            <p>「グループを追加」ボタンをクリックして開始しましょう</p>
          </div>
        ) : (
          <div className="groups-container">
            {groups.map((group) => {
              const groupTemplates = getTemplatesForGroup(group.id);
              // グループ内のどれかのテンプレートがドロップターゲットか
              const groupOverTemplateId = groupTemplates.find(
                (t) => t.id === overTemplateId
              )?.id ?? null;
              // アクティブテンプレートが別グループからドラッグされているか
              const draggedTemplate = activeTemplateId
                ? templates.find((t) => t.id === activeTemplateId)
                : undefined;
              const isHeaderDropTarget = overHeaderGroupId === group.id;
              const isAddBtnDropTarget = overAddBtnGroupId === group.id;
              const isCrossGroupDrag =
                draggedTemplate !== undefined &&
                draggedTemplate.groupId !== group.id &&
                (groupOverTemplateId !== null || isHeaderDropTarget || isAddBtnDropTarget);

              return (
                <GroupItem
                  key={group.id}
                  group={group}
                  templates={groupTemplates}
                  isExpanded={expandedGroups.has(group.id)}
                  onToggle={() => handleToggleGroup(group.id)}
                  onEdit={handleEditTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  onTemplateNameChange={handleTemplateNameChange}
                  onGroupNameChange={handleGroupNameChange}
                  onDeleteGroup={handleDeleteGroup}
                  onAddTemplate={handleAddTemplate}
                  startEditing={editingGroupId === group.id}
                  onEditingComplete={() => setEditingGroupId(null)}
                  activeTemplateId={activeTemplateId}
                  overTemplateId={groupOverTemplateId}
                  dropPosition={dropPosition}
                  isHeaderDropTarget={isHeaderDropTarget}
                  isAddBtnDropTarget={isAddBtnDropTarget}
                  isCrossGroupDrag={isCrossGroupDrag}
                />
              );
            })}
          </div>
        )}

        {isModalOpen && (
          <TemplateModal
            template={editingTemplate}
            groupId={addingToGroupId}
            onSave={handleSaveTemplate}
            onClose={handleCloseModal}
          />
        )}

        <DragOverlay dropAnimation={null}>
          {activeTemplate ? (
            <div className="template-item drag-overlay">
              <DragHandle />
              <span className="template-name">{activeTemplate.name}</span>
              <div className="template-actions">
                <button className="icon-btn" title="編集">
                  <EditIcon />
                </button>
                <button className="icon-btn delete" title="削除">
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default Options;
