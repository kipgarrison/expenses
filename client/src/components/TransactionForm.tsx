import type { TransactionFormProps } from "../types/TransactionFormProps";
import './TransactionForm.css';

export default function TransactionForm({ transaction, merchants, categories, onChange, onSave }: TransactionFormProps) {
  function setField(field: string, value: string|boolean) {
    if (field === "date") {
      onChange({ ...transaction, date: new Date(value as string) });
    } else if (field === "amount") {
      onChange({ ...transaction, amount: parseFloat(value as string) });
    } else if (field === "hasReceipt") {
      onChange({ ...transaction, hasReceipt: value as boolean });
    } else if (field === "merchant") {
      const merchant = merchants.find(m => m.name === value) ?? { id: 0, name: "" };
      onChange({ ...transaction, merchant })
    } else if (field === "category") {
      const category = categories.find(c => c.name === value) ?? { id: 0, name: "" };
      onChange({ ...transaction, category })
    } else {
      onChange({ ...transaction, [field]: value });
    }
  }
  
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    onSave(transaction);
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      {transaction.type}
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input type="date" className="form-control" id="date" name="date" data-testid="date"
          value={transaction.date.toISOString().split('T')[0]} required
          onChange={(e) => setField("date", e.target.value)} />
      </div>
      {(transaction.type === "Debit") &&
        <>
        <div className="form-group">
          <label htmlFor="merchant">Merchant</label>
          <select className="form-control" id="merchant" name="merchant" role="merchant-name" data-testid="merchants"
            value={transaction.merchant.name} 
            onChange={(e) => setField("merchant", e.target.value)} required>
            <option key=""></option>
            {merchants.map(m => (
              <option key={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="type">Category</label>
          <select className="form-control" id="type" name="type" data-testid="categories"
            value={transaction.category.name}
            onChange={(e) => setField("category", e.target.value)} required>
            <option key="none"></option>
            {categories.map(c => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        </>
      }
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input type="number" className="form-control" id="amount" name="amount" data-testid="amount"
          value={transaction.amount} required 
          onChange={(e) => setField("amount", e.target.value)}/>
      </div>
       <div className="form-group">
        <label htmlFor="comments">Comments</label>
        <textarea className="form-control" id="comments" name="comments" data-testid="comments" 
          value={transaction.comments}
          onChange={(e) => setField("comments", e.target.value)} />
      </div>
      <div className="form-group form-check">
        <input type="checkbox" className="form-check-input" id="hasReceipt" name="hasReceipt" data-testid="hasReceipt" 
          checked={transaction.hasReceipt}
          onChange={(e) => setField("hasReceipt", e.target.checked)}/>
        <label className="form-check-label" htmlFor="hasReceipt">Has Receipt</label>
      </div>
      <button type="submit" className="btn btn-primary" data-testid="submit">Submit</button>
    </form>);
}

