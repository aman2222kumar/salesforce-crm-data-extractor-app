export interface Accounttype {
  id: string;
  accountName: string;
  industry?: string;
  phone?: string;
  website?: string;
}

export interface AccountTabProps {
  data: Accounttype[];
  onDelete: (objectType: string, recordId: string) => void;
  onSync: (objectType: string) => void;
}

export interface Contacttype {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  account?: string;
  title?: string;
}

export interface ContactTabProps {
  data: Contacttype[];
  onDelete: (objectType: string, recordId: string) => void;
  onSync: (objectType: string) => void;
}

export interface Leadtype {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: string;
}

export interface LeadTabProps {
  data: Leadtype[];
  onDelete: (objectType: string, recordId: string) => void;
  onSync: (objectType: string) => void;
}

export interface Opportunitytype {
  id: string;
  opportunityName: string;
  account?: string;
  stage?: string;
  amount?: string;
  probability?: string;
  closeDate?: string;
}

export interface OpportunitiyTabProps {
  data: Opportunitytype[];
  onDelete: (objectType: string, recordId: string) => void;
  onSync: (objectType: string) => void;
}

export interface Tasktype {
  id: string;
  subject: string;
  dueDate?: string;
  status?: string;
  priority?: string;
  assignee?: string;
}

export interface TaskTabProps {
  data: Tasktype[];
  onDelete: (objectType: string, recordId: string) => void;
  onSync: (objectType: string) => void;
}
