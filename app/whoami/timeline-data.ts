export type TimelineBodyPart =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; href: string }

export type TimelineEntry = {
  year: string
  month: string
  delay: number
  body: TimelineBodyPart[]
}

export const timelineEntries: TimelineEntry[] = [
  {
    year: '2020',
    month: '2019-2020',
    delay: 0.12,
    body: [
      {
        type: 'text',
        text: 'Self-taught Python, C#, Java, C++, web dev during COVID lockdown. Freshman/sophomore year of high school. Virtual classes meant a lot of time to code.',
      },
    ],
  },
  {
    year: '2021',
    month: 'Jan 2021',
    delay: 0.3,
    body: [
      { type: 'text', text: 'Joined ' },
      {
        type: 'link',
        text: 'HackForums',
        href: 'https://hackforums.net/member.php?action=profile&uid=4922164',
      },
      { type: 'text', text: '.' },
    ],
  },
  {
    year: '2021',
    month: 'Feb 2021',
    delay: 0.48,
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
    delay: 0.66,
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
    delay: 0.84,
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
    delay: 1.02,
    body: [
      {
        type: 'text',
        text: 'Developed process hollowing with parent PID spoofing (C#). Spawns hollowed process as child of explorer.exe instead of your loader.',
      },
    ],
  },
  {
    year: '2022',
    month: 'Feb 2022',
    delay: 1.2,
    body: [
      { type: 'text', text: 'Joined ' },
      { type: 'link', text: 'HackTheBox', href: 'https://hackthebox.com' },
      { type: 'text', text: '.' },
    ],
  },
  {
    year: '2022',
    month: 'Feb 2022',
    delay: 1.38,
    body: [
      {
        type: 'text',
        text: 'Began to practice penetration testing / offensive security. Pwned 6 machines on HTB throughout this month.',
      },
    ],
  },
  {
    year: '2022',
    month: 'Jun 2022',
    delay: 1.56,
    body: [
      {
        type: 'text',
        text: 'Truly enjoying pentesting; I fell in love with the creative process. Pwned another 9 machines (15 total) this month.',
      },
    ],
  },
  {
    year: '2022',
    month: 'Sep 2022',
    delay: 1.74,
    body: [
      { type: 'text', text: '1,250+ followers on ' },
      {
        type: 'link',
        text: 'HackForums',
        href: 'https://hackforums.net/member.php?action=profile&uid=4922164',
      },
      { type: 'text', text: '. 30+ sales, 100% positive. Earned thousands in generated revenue.' },
    ],
  },
  {
    year: '2023',
    month: 'Jan 2023',
    delay: 1.92,
    body: [
      { type: 'link', text: 'HVNC', href: 'https://github.com/Meltedd/HVNC' },
      {
        type: 'text',
        text: ' project gaining in popularity in the open source community. Security researchers and professors started reaching out.',
      },
    ],
  },
  {
    year: '2023',
    month: 'Mar 2023',
    delay: 2.1,
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
    month: 'Dec 2023',
    delay: 2.28,
    body: [
      { type: 'text', text: 'Official ' },
      { type: 'link', text: 'Cobalt Strike module', href: 'https://github.com/WKL-Sec/HiddenDesktop' },
      {
        type: 'text',
        text: ' adapted from my HVNC project. My open source work is now being used in commercial offensive security tooling.',
      },
    ],
  },
  {
    year: '2024',
    month: 'Jan 2024',
    delay: 2.46,
    body: [
      { type: 'text', text: 'Starting teaching position at ' },
      { type: 'link', text: 'The Coding Place', href: 'https://www.thecodingplace.com/' },
      {
        type: 'text',
        text: ' - Python/Java/C++ for K-12 students. Turns out explaining pointers to 12 year olds can be harder than reversing malware.',
      },
    ],
  },
  {
    year: '2025',
    month: 'Apr 2025',
    delay: 2.64,
    body: [
      { type: 'text', text: 'Started at ' },
      { type: 'link', text: 'Think Big Technology', href: 'https://www.thinkbigtechnology.com/' },
      {
        type: 'text',
        text: ' as an IT Security Engineer. Managing security ops for two client organizations - quarterly internal penetration tests, incident response, infrastructure monitoring. Mentoring an intern on SOC operations.',
      },
    ],
  },
  {
    year: '2025',
    month: 'May 2025',
    delay: 2.82,
    body: [
      { type: 'text', text: 'Independently prototyped and developed an LLM-powered SEO analysis product for ' },
      { type: 'link', text: 'Think Big Technology', href: 'https://www.thinkbigtechnology.com/' },
      {
        type: 'text',
        text: ', integrating a Next.js frontend with a Flask + SQLAlchemy backend. Wrote over 9,000 lines of TypeScript and Python, designed UI/UX.',
      },
    ],
  },
  {
    year: '2025',
    month: 'Jun 2025',
    delay: 3.0,
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
    year: '2025',
    month: 'Aug 2025',
    delay: 3.18,
    body: [
      {
        type: 'text',
        text: 'Developed PowerSploit (C#) to build in-memory PowerShell loaders which use RunPE + obfuscation to execute .NET payloads. Bypassed AV runtime and scantime detection. Github repo coming soon...',
      },
    ],
  },
  {
    year: '2025',
    month: 'Sep 2025',
    delay: 3.36,
    body: [
      { type: 'text', text: 'Currently studying for CompTIA ' },
      { type: 'link', text: 'Security+', href: 'https://www.comptia.org/en-us/certifications/security/' },
      { type: 'text', text: ' and ' },
      { type: 'link', text: 'Network+', href: 'https://www.comptia.org/en-us/certifications/network/' },
      { type: 'text', text: ' certifications, completing college coursework. Open to freelance work.' },
    ],
  },
]

