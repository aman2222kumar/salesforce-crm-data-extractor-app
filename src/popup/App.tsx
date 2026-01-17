import React, { useState, useEffect, FC } from "react";
import LeadsTab from "./tabs/LeadsTab";
import ContactsTab from "./tabs/ContactsTab";
import AccountsTab from "./tabs/AccountsTab";
import OpportunitiesTab from "./tabs/OpportunitiesTab";
import TasksTab from "./tabs/TasksTab";
import StorageService from "../utils/storage";

interface StorageData {
  leads: any[];
  contacts: any[];
  accounts: any[];
  opportunities: any[];
  tasks: any[];
  lastSync: Record<string, number>;
}

const emptyData: StorageData = {
  leads: [],
  contacts: [],
  accounts: [],
  opportunities: [],
  tasks: [],
  lastSync: {},
};

const App: FC = () => {
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [data, setData] = useState<StorageData>(emptyData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    loadData();

    const handleStorageChange = (
      changes: Record<string, any>,
      areaName: string,
    ) => {
      if (areaName === "local" && changes.salesforce_data) {
        setData(changes.salesforce_data.newValue || emptyData);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    const interval = setInterval(loadData, 2000);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadData = async () => {
    const storedData = await StorageService.getData();
    setData(storedData);
  };

  const handleSync = async () => {
    setIsLoading(true);
    setMessage("Syncing current page...");

    const response = await StorageService.extractCurrentObject();

    if (response?.success) {
      setMessage(`Synced ${response.count} ${response.objectType}`);
      await loadData();
    } else {
      setMessage(`Failed: ${response?.error}`);
    }

    setTimeout(() => setMessage(""), 3000);
    setIsLoading(false);
  };

  const handleDelete = async (objectType: string, recordId: string) => {
    if (window.confirm("Delete this record?")) {
      await StorageService.deleteRecord(objectType, recordId);
      await loadData();
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Clear all data?")) {
      await StorageService.clearAll();
      await loadData();
    }
  };

  const totalRecords =
    data.leads.length +
    data.contacts.length +
    data.accounts.length +
    data.opportunities.length +
    data.tasks.length;

  const renderTabContent = () => {
    switch (activeTab) {
      case "leads":
        return (
          <LeadsTab
            data={data.leads}
            onDelete={handleDelete}
            onSync={handleSync}
          />
        );
      case "contacts":
        return (
          <ContactsTab
            data={data.contacts}
            onDelete={handleDelete}
            onSync={handleSync}
          />
        );
      case "accounts":
        return (
          <AccountsTab
            data={data.accounts}
            onDelete={handleDelete}
            onSync={handleSync}
          />
        );
      case "opportunities":
        return (
          <OpportunitiesTab
            data={data.opportunities}
            onDelete={handleDelete}
            onSync={handleSync}
          />
        );
      case "tasks":
        return (
          <TasksTab
            data={data.tasks}
            onDelete={handleDelete}
            onSync={handleSync}
          />
        );
      default:
        return (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalRecords}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Objects Tracked</p>
                <p className="text-2xl font-bold text-purple-600">5</p>
              </div>
            </div>
          </div>
        );
    }
  };

  const tabs = [
    { id: "summary", label: "Summary", count: totalRecords },
    { id: "leads", label: "Leads", count: data.leads.length },
    { id: "contacts", label: "Contacts", count: data.contacts.length },
    { id: "accounts", label: "Accounts", count: data.accounts.length },
    { id: "opportunities", label: "Opps", count: data.opportunities.length },
    { id: "tasks", label: "Tasks", count: data.tasks.length },
  ];

  return (
    <div className="flex flex-col h-full bg-white max-w-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <h1 className="text-lg font-bold">Salesforce CRM Extractor</h1>
        <p className="text-blue-100 text-sm">Extract and manage CRM data</p>

        {/* Top action bar */}
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          <button
            onClick={handleSync}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white text-blue-600 rounded-md text-sm font-medium"
          >
            {isLoading ? "Syncing..." : "Extract"}
          </button>
          <button
            onClick={StorageService.exportAsJSON}
            className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm"
          >
            Export JSON
          </button>
          <button
            onClick={StorageService.exportAsCSV}
            className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm"
          >
            Export CSV
          </button>
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Message */}
      {message ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 m-4">
          <p className="text-sm text-blue-700">{message}</p>
        </div>
      ) : null}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>

      {/* Bottom Tabs */}
      <div className="flex border-t bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-semibold ${
              activeTab === tab.id
                ? "text-red-600 border-t-2 border-blue-600 bg-white"
                : "text-orange-500"
            }`}
          >
            {tab.label}
            <div className="text-[10px]">{tab.count}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
