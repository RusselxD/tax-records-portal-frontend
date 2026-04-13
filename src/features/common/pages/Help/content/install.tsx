import { Download } from "lucide-react";
import { P, Heading, Steps, Tip } from "./shared";
import type { HelpSection } from "../types";

export const installSection: HelpSection = {
  id: "install",
  title: "Installing the App",
  subtitle: "Add the portal to your home screen or desktop",
  icon: Download,
  iconBg: "bg-indigo-50",
  iconColor: "text-indigo-600",
  content: (
    <>
      <P>
        The Tax Records Portal is a Progressive Web App (PWA). You can install
        it on your device so it opens like a normal app — its own window, its
        own icon, and faster to launch than going through the browser each time.
      </P>

      <Heading>Desktop — Chrome, Edge, Brave, or Opera</Heading>
      <P>
        When the app is installable, an <strong>Install App</strong> button
        appears near the bottom of the sidebar. Click it and confirm the
        browser prompt. If you don't see the button, you can also install from
        the browser itself:
      </P>
      <Steps
        items={[
          'Look for the install icon in the address bar — a small monitor with a down arrow, usually on the right side of the URL.',
          'Click it, then click "Install" in the popup.',
          'The app opens in its own window and an icon is added to your desktop, Start menu, or Applications folder.',
        ]}
      />

      <Heading>Desktop — Safari (macOS 14 Sonoma or later)</Heading>
      <Steps
        items={[
          'Open the portal in Safari.',
          'Click File in the menu bar, then choose "Add to Dock".',
          'Adjust the name if you like, then click Add. The app appears in your Dock and launches in its own window.',
        ]}
      />
      <P>
        Older versions of Safari and Firefox don't support installing web apps.
        Use Chrome or Edge on those systems.
      </P>

      <Heading>Android — Chrome</Heading>
      <Steps
        items={[
          'Open the portal in Chrome.',
          'Tap the three-dot menu in the top-right corner.',
          'Tap "Install app" (or "Add to Home screen" on older versions).',
          'Confirm, and the app icon appears on your home screen. It opens full-screen without the browser UI.',
        ]}
      />
      <P>
        Samsung Internet and other Android browsers have the same option under
        their menu — look for "Install" or "Add page to".
      </P>

      <Heading>iPhone and iPad — Safari</Heading>
      <P>
        iOS only supports installing from Safari, and there is no automatic
        prompt — you have to do it manually.
      </P>
      <Steps
        items={[
          'Open the portal in Safari (not Chrome or any other browser).',
          'Tap the Share button at the bottom of the screen (a square with an arrow pointing up).',
          'Scroll down and tap "Add to Home Screen".',
          'Confirm the name and tap Add. The app icon appears on your home screen.',
        ]}
      />
      <Tip>
        On iPhone and iPad, you must use Safari to install the app. Chrome,
        Firefox, and other browsers on iOS don't offer the "Add to Home Screen"
        option for web apps.
      </Tip>

      <Heading>Why install it?</Heading>
      <P>
        The installed app opens in its own window without browser tabs or the
        address bar, launches faster, keeps you signed in across sessions, and
        feels like any other app on your device. All the same features work —
        it's the same portal, just in a cleaner window.
      </P>
    </>
  ),
};
