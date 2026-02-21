export interface JournalEntry {
  id?: string;
  entryNumber: string;
  date: Date;
  reference: string;
  memo: string;
  lines: JournalEntryLine[];
  status: 'draft' | 'posted' | 'cancelled';
  totalDebit: number;
  totalCredit: number;
}

export interface JournalEntryLine {
  accountId: string; 
  accountName: string;
  debit: number;
  credit: number;
  memo?: string;
}
