# Elvana Media site: interaction plan (direction A, "Hoarding")

The site's world is Mumbai street media: posters, wheat paste, hoardings, sign painting, station boards. Every interaction comes from that world.

The kit's rules apply on every page:
- one signature moment per page;
- one ambient system for the whole site (paste-on-scroll);
- everything else quiet and precise;
- every interaction has a keyboard and touch equivalent, a reduced-motion still version, and readable content without JavaScript.

## Site-wide (every page)

| Element | What it does |
| --- | --- |
| **Paste-on-scroll** (ambient) | Each poster section is squeegeed onto the wall as you scroll into it. The motion is scrubbed, so it reverses on scroll-back. |
| **Paste-over page transitions** | Clicking a link pastes the next page's poster over the current one with a squeegee wipe. Back peels it off. Uses cross-document View Transitions (Chrome, Edge, Safari); browsers without support simply navigate. Under 600 ms. |
| **Corner lift** | Service and link posters lift a corner a few degrees on hover or focus. |
| **"Coming soon" snipes** | Every honest TODO (prices, photos, case studies) is a diagonal strip pasted across the poster, the way cinemas paste "Housefull" over a film poster. |
| **Rubber-stamp buttons** | Primary buttons press like an ink stamp: a slight squash, then an ink ring. |
| **Paper sounds** (off by default) | A rip, a paste slap and a stamp thud, synthesised in the browser with no audio files. The toggle sits in the footer next to the slow-motion switch. Android also gets a short haptic tick on the tear. |
| **Hindi echoes** | Short Devanagari lines in the sign-painter face where they add meaning (a native speaker signs them off). |

## One signature per page

| Page | Signature moment |
| --- | --- |
| **Home** | **Tear the hoarding.** Rip strips off the yellow poster to reveal "Get seen. Get chosen. Grow." The physics is being rebuilt so every curl and roll behaves like the same paper. |
| **Services** | **The fly-poster wall.** All 14 services pasted as one wall. Filtering by Create / Connect / Grow tears the other posters down and slaps the matching ones into place. |
| **Each service page (14)** | **Corner peel + a live specimen.** Peel the hero poster's corner to reveal the service's promise, then try a small, clearly labelled demo of the service itself. |
| **Our edge** | **Follow one lead.** A pinned scroll story: one person sees a post, chats with the WhatsApp bot (you can type to it), gets a reminder SMS, then an AI call, then reaches the team. |
| **How we work** | **The paste-up.** The five steps pasted one over another as you scroll. The last layer completes a finished campaign poster. |
| **Industries** | **The tri-vision hoarding.** The rotating-slat billboard seen on Indian highways. Pick a sector and the slats turn one by one to show what that sector needs and which services fit. |
| **Engagement models** | **The ticket counter.** Choose Retainer, Campaign or Project and a ticket prints; tear off the stub to send an enquiry with that model pre-selected. |
| **Work** | **"This space is available."** An empty hoarding with the classic advertise-here board. Type your brand name and a sign-painter's brush paints it on, as an honest invitation to be one of the first case studies. |
| **About** | **Layers of the wall.** Scrolling strips poster layers back one by one: why Elvana exists, the founder, the team, the BeyondSure group, the cities. Team posters peel to reveal each person's focus. |
| **Contact** | **Paste your enquiry.** The form is a blank poster. On send it's squeegeed onto the wall and stamped "RECEIVED", with a WhatsApp sign and the four cities as station boards. |
| **404** | **Torn down.** The page has been torn off the wall. Drag the scraps aside to find the search and the most useful links. |
| **Privacy, Terms, case-study template** | Nothing extra: plain, readable pages. |

## Specimens for the 14 service pages

These are small, illustrative and labelled "Mock-up", with no invented numbers.

| Service | Specimen |
| --- | --- |
| **Website Development** | A landing page that assembles itself from wireframe to finished as you scroll. |
| **SEO & SEM** | An illustrative search results page with your typed business name in an ad and a local listing. |
| **SMS Blasting** | A phone receiving a DLT-style message with a sender ID; tap to change the template type. |
| **WhatsApp Blasting** | An opted-in broadcast list; send and watch it arrive with buttons. |
| **WhatsApp Chat Bot** | A chat you can actually type into (scripted answers). |
| **AI Calling** | Play a sample call (English or Hinglish transcript with a waveform). |
| **Post Creation & Content** | A carousel you swipe, plus a month's calendar. |
| **Content & Video Production** | A film strip you scrub from storyboard to finished frame. |
| **Branding & Identity** | A brand book you flip through. |
| **Events & Activations** | An event ticket you tear. |
| **Outdoor, Hoardings & Signage** | Type your brand onto a hoarding at three sizes: highway, street, shopfront. |
| **Print & Digital Publishing** | A magazine page you turn. |
| **PR & Media Relations** | A newspaper front page that sets your headline in hot metal. |
| **Social Media Management** | A week of posts you can drag between days. |

## Restraint rules for builders

- Only one of the moments above per page. If a page feels busy, take one thing away.
- Specimens sit below the hero, never on top of it, and are labelled "Mock-up".
- Page transitions never block a click and never exceed 600 ms.
- Sound and haptics are never on by default and never required.
