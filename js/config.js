/* ============================================================================
   INVITATION CONFIG  —  edit this file only.
   Everything on the page (names, dates, venue, quotes, images, music, colours)
   is read from this single object at load time.
   ========================================================================= */

window.INVITE = {

  /* ── 1. THE COUPLE ─────────────────────────────────────────────────────── */
  couple: {
    groom: 'Nithish',
    bride: 'Ramapriya',
    // Shown in the browser tab and in WhatsApp / social previews.
    shortTitle: 'Nithish & Ramapriya',
    tagline: 'Two hearts, one beautiful beginning.',
    quote: 'Bound not by ceremony alone, but by the quiet promise of every day that follows.',
    // Couple photograph. Replace with your own (portrait or square works best).
    // Leave empty to hide the photograph entirely.
    photo: '',
    photoAlt: 'Nithish and Ramapriya',
  },

  /* ── 2. THE EVENT ──────────────────────────────────────────────────────── */
  event: {
    title: 'Engagement Invitation',
    subtitle: 'Nichayathartham',
    // ISO 8601 with timezone offset. +05:30 = India Standard Time.
    startsAt: '2026-11-22T12:00:00+05:30',
    endsAt:   '2026-11-22T15:30:00+05:30',
    // Human-readable strings (shown on the card — keep them in your own words).
    dateLabel: 'Sunday, 22 November 2026',
    dateSub:   'Shubha Muhurtham',
    timeLabel: '12:00 PM onwards',
    timeSub:   'Lunch will be served',
    invitationLine:
      'With the blessings of our families, we joyfully invite you to celebrate the engagement of',
    closingLine:
      'We look forward to celebrating this beautiful beginning with you.',
    // Optional Sanskrit / Tamil invocation at the very top. Set to '' to hide.
    invocation: '॥ श्री गणेशाय नमः ॥',
    // Shown on the opening envelope screen.
    welcomeLine: 'You are invited',
    openHint: 'Tap the envelope to open',
  },

  /* ── 3. THE VENUE ──────────────────────────────────────────────────────── */
  venue: {
    name: 'Vettri Krishnan Mahal',
    addressLines: [
      '49/1, Govindan Road',
      'Near Srinivasa Theatre, West Mambalam',
      'Chennai, Tamil Nadu 600033',
    ],
    // Paste any Google / Apple Maps link here. Leave empty to hide the button.
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Vettri+Krishnan+Mahal+West+Mambalam+Chennai',
  },

  /* ── 4. THE FAMILIES ───────────────────────────────────────────────────── */
  families: {
    groom: {
      heading: "Groom's Family",
      relation: 'Son of',
      parents: ['Thiru. Selvam', 'Tmt. Kalyani Selvam'],
      place: 'Sriperumbudur',
    },
    bride: {
      heading: "Bride's Family",
      relation: 'Daughter of',
      parents: ['Thiru. Ravichandran', 'Tmt. Gayathri Ravichandran'],
      place: 'Saidapet',
    },
    note: 'Together with their brothers, sisters and well-wishers',
  },

  /* ── 5. RSVP (optional — set enabled:false to hide the block) ───────────── */
  rsvp: {
    // Off until a real number is in place — a public page must not send
    // guests to someone else's phone.
    enabled: false,
    label: 'RSVP',
    // International format, digits only, no + or spaces.
    // TODO — replace with the real number.
    whatsapp: '919876543210',
    phoneDisplay: '+91 98765 43210',
    message: 'We are delighted to accept your invitation!',
  },

  /* ── 6. OPTIONS ────────────────────────────────────────────────────────── */
  options: {
    countdown: true,        // show the live countdown section
    music: true,            // show the music toggle (never autoplays)
    // Paths are resolved against the folder holding this config file, so the
    // same value works from the root template and from /floral/.
    musicSrc: 'assets/music/invitation.m4a',
    musicLabel: 'Play music',
    floatingFlowers: true,  // gentle jasmine petals drifting down
    flowerCount: 14,
    envelope: true,         // opening "unseal the invitation" overlay
  },
};
