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
    year: '2019',
    month: 'Sep 2019',
    body: [
      { type: 'text', text: 'Learned JavaScript through ' },
      { type: 'link', text: 'freeCodeCamp', href: 'https://www.freecodecamp.org/' },
      { type: 'text', text: ' to write a Chrome extension that automated my dreadful ' },
      { type: 'link', text: 'Membean', href: 'https://membean.com/' },
      { type: 'text', text: ' homework. Gave the extension to my friends in the spirit of open source.' },
    ],
  },
  {
    year: '2020',
    month: 'Mar-Dec 2020',
    body: [
      { type: 'text', text: 'Spent COVID lockdown teaching myself C# through YouTube (thanks ' },
      { type: 'link', text: 'Mosh', href: 'https://www.youtube.com/@programmingwithmosh' },
      { type: 'text', text: ') and pet projects, mostly WinForms/WPF desktop apps and client/server apps over TCP sockets.' },
    ],
  },
  {
    year: '2021',
    month: 'Apr 2021',
    body: [
      { type: 'text', text: 'Signed up to ' },
      { type: 'link', text: 'crackmes', href: 'https://crackmes.one/' },
      { type: 'text', text: ' to learn reverse engineering. Learned ' },
      { type: 'link', text: 'Ghidra', href: 'https://www.nsa.gov/ghidra' },
      { type: 'text', text: ' for native code, ' },
      { type: 'link', text: 'DnSpy', href: 'https://github.com/dnSpy/dnSpy' },
      { type: 'text', text: ' and ' },
      { type: 'link', text: 'ILSpy', href: 'https://github.com/icsharpcode/ILSpy' },
      { type: 'text', text: ' for .NET apps. Wrote C++ on the side, mostly to have more binaries to practice on.' },
    ],
  },
  {
    year: '2022',
    month: 'Sep 2022',
    body: [
      { type: 'text', text: 'Fixed, modernized, and reconstructed HVNC in ' },
      { type: 'link', text: 'Tinynuke', href: 'https://github.com/rossja/TinyNuke' },
      {
        type: 'text',
        text: ' as standalone client/server (C++). Posted to ',
      },
      { type: 'link', text: 'GitHub', href: 'https://github.com/Meltedd/HVNC' },
      { type: 'text', text: ' as my largest software undertaking to date.' },
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
    month: 'Aug 2023',
    body: [
      { type: 'text', text: 'Built ' },
      { type: 'link', text: 'VisualSploit', href: 'https://github.com/Meltedd/VisualSploit' },
      { type: 'text', text: ', a C# tool that weaponizes .csproj files to execute arbitrary code when opened in Visual Studio, under a signed Microsoft binary. Inspired by the ' },
      { type: 'link', text: '2021 North Korean supply chain attack', href: 'https://visualstudiomagazine.com/articles/2021/02/01/dprk-attack.aspx' },
      { type: 'text', text: ' against security researchers.' },
    ],
  },
  {
    year: '2023',
    month: 'Dec 2023',
    body: [
      { type: 'link', text: 'WKL-Sec', href: 'https://github.com/WKL-Sec/HiddenDesktop' },
      {
        type: 'text',
        text: ' adapted my HVNC project into a Cobalt Strike module, bringing it into commercial offensive security tooling.',
      },
    ],
  },
  {
    year: '2024',
    month: 'Jun 2024-Jan 2025',
    body: [
      {
        type: 'text',
        text: 'Taught Python, Java, and C++ to K-12 students at ',
      },
      { type: 'link', text: 'The Coding Place', href: 'https://www.thecodingplace.com/' },
      {
        type: 'text',
        text: '. Turns out explaining pointers to 12-year-olds is harder than reversing malware.',
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
        text: ', where I managed security operations for two client organizations and mentored an intern in SOC operations.',
      },
    ],
  },
  {
    year: '2025',
    month: 'Dec 2025',
    body: [
      { type: 'text', text: 'Joined ' },
      { type: 'link', text: 'HackerOne', href: 'https://hackerone.com/0xmaxhax' },
      { type: 'text', text: ' to hunt for bug bounties in order to help pay off student loans and university expenses.' },
    ],
  },
  {
    year: '2026',
    month: 'Jan 2026',
    body: [
      { type: 'text', text: 'Discovered a high-severity vulnerability in Netflix production systems ($5,100 bounty).' },
    ],
  },
  {
    year: '2026',
    month: 'Jan 2026',
    body: [
      { type: 'text', text: 'Disclosed a DoS vulnerability in Node.js TLS error handling (' },
      { type: 'link', text: 'CVE-2026-21637', href: 'https://nvd.nist.gov/vuln/detail/CVE-2026-21637' },
      { type: 'text', text: ', ~$1,000 bounty).' },
    ],
  },
  {
    year: '2026',
    month: 'Feb 2026',
    body: [
      { type: 'text', text: 'Reached 99th percentile on ' },
      { type: 'link', text: 'HackerOne', href: 'https://hackerone.com/0xmaxhax' },
      { type: 'text', text: ' with a 7.00 ' },
      { type: 'link', text: 'signal rating', href: 'https://docs.hackerone.com/en/articles/8369891-signal-impact' },
      { type: 'text', text: '.' },
    ],
  },
  {
    year: '2026',
    month: 'Mar 2026',
    body: [
      { type: 'text', text: 'Built ' },
      { type: 'link', text: 'Scarecrow', href: 'https://github.com/Meltedd/scarecrow' },
      { type: 'text', text: ', an adversarial pattern optimizer for evading automated license plate recognition. Designed as a privacy tool against ' },
      { type: 'link', text: 'warrantless mass surveillance', href: 'https://www.eff.org/deeplinks/2025/12/effs-investigations-expose-flock-safetys-surveillance-abuses-2025-review' },
      { type: 'text', text: '.' },
    ],
  },
  {
    year: '2026',
    month: 'Apr 2026',
    body: [
      { type: 'text', text: 'Discovered another high-severity vulnerability for Netflix ($5,000 bounty).' },
    ],
  },
]

