import { useMemo, useState } from "react";
import {
  Card,
  CardStatus,
  COLUMN_LABELS,
  COLUMN_ORDER,
} from "../interfaces/card";
import CardForm from "../components/CardForm";
import { useBoard } from "../hooks/useBoard";

const BoardPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const { mode, cards, users, addCard, updateCard, deleteCard } = useBoard();

  const cardsByStatus = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = cards.filter((card) => {
      if (!query) return true;

      return (
        card.title.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query) ||
        card.assignee.name.toLowerCase().includes(query)
      );
    });

    const map: Record<CardStatus, Card[]> = {
      todo: [],
      "in-progress": [],
      done: [],
    };

    filtered.forEach((card) => {
      map[card.status].push(card);
    });

    return map;
  }, [cards, searchQuery]);

  const totalCardCount = useMemo(
    () => Object.values(cardsByStatus).flat().length,
    [cardsByStatus],
  );

  const openAddCard = () => {
    setEditingCard(null);
    setShowForm(true);
  };

  const openEditCard = (card: Card) => {
    setEditingCard(card);
    setShowForm(true);
  };

  return (
    <div className="board-page">
      <header className="board-header">
        <div>
          <h1 className="board-title">Kanban Board</h1>
          <p className="board-sub">
            {totalCardCount} cards across {COLUMN_ORDER.length} columns · State:{" "}
            {mode}
          </p>
        </div>
        <div className="presence-bar">
          <strong>Online:</strong>

          {users.map((user) => (
            <span key={user.id} className="assignee-chip">
              {user.name}
            </span>
          ))}
        </div>
        <div className="board-actions">
          <input
            className="search-input"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button className="btn-add" onClick={openAddCard}>
            + Add Card
          </button>
        </div>
      </header>

      <div className="board">
        {COLUMN_ORDER.map((status) => (
          <div key={status} className={`column col-${status}`}>
            <div className="column-header">
              <span className="column-title">{COLUMN_LABELS[status]}</span>
              <span className="column-count">
                {cardsByStatus[status].length}
              </span>
            </div>

            <div className="card-list">
              {cardsByStatus[status].map((card) => (
                <div
                  key={card.id}
                  className={`card-card ${card.status === "done" ? "card-done" : ""}`}
                >
                  <div className="card-title">{card.title}</div>

                  {card.description && (
                    <p className="card-description">{card.description}</p>
                  )}

                  <div className="card-footer">
                    <span className="assignee-chip">{card.assignee.name}</span>
                  </div>

                  <div className="card-footer">
                    <select
                      className="filter-select"
                      value={card.status}
                      onChange={(e) =>
                        updateCard(card.id, {
                          status: e.target.value as CardStatus,
                        })
                      }
                    >
                      {COLUMN_ORDER.map((columnStatus) => (
                        <option key={columnStatus} value={columnStatus}>
                          {COLUMN_LABELS[columnStatus]}
                        </option>
                      ))}
                    </select>

                    <div className="card-actions">
                      <button
                        className="icon-btn"
                        onClick={() => openEditCard(card)}
                      >
                        ✎
                      </button>

                      <button
                        className="icon-btn danger"
                        onClick={() => deleteCard(card.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {cardsByStatus[status].length === 0 && (
                <div className="empty-column">No cards in this column</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <CardForm
          card={editingCard}
          onClose={() => setShowForm(false)}
          onSave={(data) => {
            if (editingCard) updateCard(editingCard.id, data);
            else addCard(data);

            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};

export default BoardPage;
