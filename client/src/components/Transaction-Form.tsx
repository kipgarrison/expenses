import type { TransactionFormProps } from "../types/TransactionFormProps";
import './Transaction-Form.css';

export default function TransactionForm({ transaction, merchants, types, onChange, onSave }: TransactionFormProps) {
  function setField(field: string, value: string|boolean) {
    if (field === "date") {
      onChange({ ...transaction, date: new Date(value as string) });
    } else if (field === "amount") {
      onChange({ ...transaction, amount: parseFloat(value as string) });
    } else if (field === "hasReceipt") {
      onChange({ ...transaction, hasReceipt: value as boolean });
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
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input type="date" className="form-control" id="date" name="date" 
          value={transaction.date.toISOString().split('T')[0]} required
          onChange={(e) => setField("date", e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="merchant">Merchant</label>
        <select className="form-control" id="merchant" name="merchant" role="merchant-name"
          value={transaction.merchant} 
          onChange={(e) => setField("merchant", e.target.value)} required>
          <option></option>
          {merchants.map(m => (
            <option>{m}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="type">Type</label>
        <select className="form-control" id="type" name="type" 
          value={transaction.type}
          onChange={(e) => setField("type", e.target.value)} required>
          <option></option>
          {types.map(t => (
            <option>{t}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input type="number" className="form-control" id="amount" name="amount" 
          value={transaction.amount} required 
          onChange={(e) => setField("amount", e.target.value)}/>
      </div>
       <div className="form-group">
        <label htmlFor="comments">Comments</label>
        <textarea className="form-control" id="comments" name="comments" 
          value={transaction.comments}
          onChange={(e) => setField("comments", e.target.value)} />
      </div>
      <div className="form-group form-check">
        <input type="checkbox" className="form-check-input" id="hasReceipt" name="hasReceipt" 
          checked={transaction.hasReceipt}
          onChange={(e) => setField("hasReceipt", e.target.checked)}/>
        <label className="form-check-label" htmlFor="hasReceipt">Has Receipt</label>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>);
}

