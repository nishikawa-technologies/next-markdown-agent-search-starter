import { agentDiscoveryPaths } from '@/utils/agentDiscovery';

/** AI / クローラ向け: llms.txt と知識インデックス JSON への発見用 link */
export function AgentDiscoveryHeadLinks() {
  return (
    <>
      <link rel="llms-txt" href={agentDiscoveryPaths.llmsTxt} />
      <link
        rel="alternate"
        type="application/json"
        href={agentDiscoveryPaths.knowledgeIndex}
        title="Agent knowledge index"
      />
    </>
  );
}
