import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Tabs = () => (
  <TabsList className="grid grid-cols-3">
    <TabsTrigger value="editor">
      <span className="sr-only">Complete</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
        <rect x="4" y="3" width="12" height="2" rx="1" fill="currentColor" />
        <rect x="4" y="7" width="12" height="2" rx="1" fill="currentColor" />
        <rect x="4" y="11" width="3" height="2" rx="1" fill="currentColor" />
        <rect x="4" y="15" width="3" height="2" rx="1" fill="currentColor" />
        <rect x="8.5" y="11" width="3" height="2" rx="1" fill="currentColor" />
        <rect x="8.5" y="15" width="3" height="2" rx="1" fill="currentColor" />
        <rect x="13" y="11" width="3" height="2" rx="1" fill="currentColor" />
      </svg>
    </TabsTrigger>
    <TabsTrigger value="editor/deserialized">
      <span className="sr-only">Insert</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.491 7.769a.888.888 0 0 1 .287.648.888.888 0 0 1-.287.648l-3.916 3.667a1.013 1.013 0 0 1-.692.268c-.26 0-.509-.097-.692-.268L5.275 9.065A.886.886 0 0 1 5 8.42a.889.889 0 0 1 .287-.64c.181-.17.427-.267.683-.269.257-.002.504.09.69.258L8.903 9.87V3.917c0-.243.103-.477.287-.649.183-.171.432-.268.692-.268.26 0 .509.097.692.268a.888.888 0 0 1 .287.649V9.87l2.245-2.102c.183-.172.432-.269.692-.269.26 0 .508.097.692.269Z"
          fill="currentColor"
        />
        <rect x="4" y="15" width="3" height="2" rx="1" fill="currentColor" />
        <rect x="8.5" y="15" width="3" height="2" rx="1" fill="currentColor" />
        <rect x="13" y="15" width="3" height="2" rx="1" fill="currentColor" />
      </svg>
    </TabsTrigger>
    <TabsTrigger value="deserialized">
      <span className="sr-only">Edit</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
        <rect x="4" y="3" width="12" height="2" rx="1" fill="currentColor" />
        <rect x="4" y="7" width="12" height="2" rx="1" fill="currentColor" />
        <rect x="4" y="11" width="3" height="2" rx="1" fill="currentColor" />
        <rect x="4" y="15" width="4" height="2" rx="1" fill="currentColor" />
        <rect x="8.5" y="11" width="3" height="2" rx="1" fill="currentColor" />
        <path
          d="M17.154 11.346a1.182 1.182 0 0 0-1.671 0L11 15.829V17.5h1.671l4.483-4.483a1.182 1.182 0 0 0 0-1.671Z"
          fill="currentColor"
        />
      </svg>
    </TabsTrigger>
  </TabsList>
);
