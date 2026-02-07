export type TimelineBodyPart =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; href: string }

export interface TimelineEntry {
  year: string
  month: string
  body: TimelineBodyPart[]
}

export const timelineEntries: TimelineEntry[] = [
  {
    year: '2020',
    month: '2019-2020',
    body: [
      {
        type: 'text',
        text: 'Self-taught Python, C#, Java, C++, and web dev during COVID lockdown. Freshman/sophomore year of high school.',
      },
    ],
  },
  {
    year: '2021',
    month: 'Feb 2021',
    body: [
      {
        type: 'text',
        text: 'Built my first RAT (C#) - delivery was basic process injection + RunPE. Learned COM hijacking for persistence. Figured out how to unhook NTDLL to dodge userland hooks.',
      },
    ],
  },
  {
    year: '2021',
    month: 'Mar 2021',
    body: [
      { type: 'text', text: 'Signed up to ' },
      { type: 'link', text: 'crackmes', href: 'https://crackmes.one/' },
      { type: 'text', text: ' to learn reverse engineering. Learned ' },
      { type: 'link', text: 'Ghidra', href: 'https://www.nsa.gov/ghidra' },
      { type: 'text', text: ' for native code, ' },
      { type: 'link', text: 'DnSpy', href: 'https://github.com/dnSpy/dnSpy' },
      { type: 'text', text: ' and ' },
      { type: 'link', text: 'ILSpy', href: 'https://github.com/icsharpcode/ILSpy' },
      { type: 'text', text: ' for .NET apps.' },
    ],
  },
  {
    year: '2021',
    month: 'Sep 2021',
    body: [
      { type: 'text', text: 'Fixed, modernized, and reconstructed HVNC in ' },
      { type: 'link', text: 'Tinynuke', href: 'https://github.com/rossja/TinyNuke' },
      {
        type: 'text',
        text: ' as standalone client/server (C++). Hidden desktop sessions, browser launching, remote access without the botnet overhead. Posted to ',
      },
      { type: 'link', text: 'GitHub', href: 'https://github.com/Meltedd/HVNC' },
      { type: 'text', text: '.' },
    ],
  },
  {
    year: '2022',
    month: 'Jan 2022',
    body: [
      {
        type: 'text',
        text: 'Built a process hollowing loader with PPID spoofing (C#). Hollowed processes spawned under explorer.exe to break parent-child chain analysis.',
      },
    ],
  },
  {
    year: '2023',
    month: 'Mar 2023',
    body: [
      { type: 'text', text: 'Reverse engineered live malware from ' },
      {
        type: 'link',
        text: 'Venom RAT',
        href: 'https://www.acronis.com/en/tru/posts/venomrat-a-remote-access-tool-with-dangerous-consequences/',
      },
      { type: 'text', text: ', ' },
      {
        type: 'link',
        text: 'Pandora HVNC',
        href: 'https://securityboulevard.com/2023/12/silent-yet-powerful-pandora-hvnc-the-popular-cybercrime-tool-that-flies-under-the-radar/',
      },
      { type: 'text', text: ' (both C# .NET). Shared IOCs with Antivirus vendors via ' },
      { type: 'link', text: 'VirusTotal', href: 'https://www.virustotal.com' },
      { type: 'text', text: '.' },
    ],
  },
  {
    year: '2023',
    month: '2023',
    body: [
      { type: 'text', text: 'Built ' },
      { type: 'link', text: 'VisualSploit', href: 'https://github.com/Meltedd/VisualSploit' },
      {
        type: 'text',
        text: ' (C#) to demonstrate MSBuild exploitation. Malicious .csproj files that execute code through trusted build processes. Based on that 2021 NK supply chain attack against security researchers.',
      },
    ],
  },
  {
    year: '2023',
    month: 'Dec 2023',
    body: [
      { type: 'text', text: 'Official ' },
      { type: 'link', text: 'Cobalt Strike module', href: 'https://github.com/WKL-Sec/HiddenDesktop' },
      {
        type: 'text',
        text: ' adapted from my HVNC project. Open source work making its way into commercial offensive security tooling.',
      },
    ],
  },
  {
    year: '2024',
    month: 'Jun 2024-Jan 2025',
    body: [
      { type: 'text', text: 'Taught at ' },
      { type: 'link', text: 'The Coding Place', href: 'https://www.thecodingplace.com/' },
      {
        type: 'text',
        text: ' - Python/Java/C++ for K-12 students. Turned out explaining pointers to 12-year-olds could be harder than reversing malware.',
      },
    ],
  },
  {
    year: '2025',
    month: 'May-Dec 2025',
    body: [
      { type: 'text', text: 'IT Security Engineer at ' },
      { type: 'link', text: 'Think Big Technology', href: 'https://www.thinkbigtechnology.com/' },
      {
        type: 'text',
        text: '. Managed security ops for two client organizations - quarterly internal penetration tests, incident response, infrastructure monitoring. Mentored an intern on SOC operations.',
      },
    ],
  },
  {
    year: '2025',
    month: 'Dec 2025',
    body: [
      { type: 'text', text: 'Joined ' },
      { type: 'link', text: 'HackerOne', href: 'https://hackerone.com/0xmaxhax' },
      { type: 'text', text: '.' },
    ],
  },
  {
    year: '2025',
    month: 'Dec 2025',
    body: [
      { type: 'text', text: 'Found a high-severity vulnerability in Netflix production systems ($5,100 bounty).' },
    ],
  },
  {
    year: '2026',
    month: '2026',
    body: [
      { type: 'text', text: 'Found a DoS vulnerability in Node.js TLS error handling (' },
      { type: 'link', text: 'CVE-2026-21637', href: 'https://nvd.nist.gov/vuln/detail/CVE-2026-21637' },
      { type: 'text', text: ', ~$1,000 bounty).' },
    ],
  },
  {
    year: '2026',
    month: '2026',
    body: [
      { type: 'text', text: 'Reached 99th percentile on ' },
      { type: 'link', text: 'HackerOne', href: 'https://hackerone.com/0xmaxhax' },
      { type: 'text', text: ' with a 7.00 signal rating.' },
    ],
  },
]

