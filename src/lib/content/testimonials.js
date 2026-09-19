// =====================================================================
// Client testimonials.
//
// Owner feedback §3: "Add testimonials from recognizable clients. Prioritize
// names like TCL, Hisense, Segway, Meitu, Ulike, Gong cha — with name, title
// and photo. One attributed quote does more than a full logo wall (needs
// client sign-off)."
//
// Nothing is listed below because no quote has been collected or signed off
// yet, and an invented testimonial is the one thing a credibility section
// cannot survive. The section is wired up and styled: add entries here and it
// appears on the home page under the client logo wall. `enabled: false` hides
// it outright even if entries exist, for staging a quote before sign-off
// lands.
//
// Each entry:
//   quote    — the sentence, without surrounding quotation marks
//   name     — the person, spelled as they want to be credited
//   role     — their title
//   company  — the brand, as it appears on the logo wall
//   image    — optional headshot under static/assets/attencity/ (square crops
//              best; a card with no image falls back to a monogram)
//   imageAlt — optional; defaults to the person's name
//   service  — optional service slug, so the quote can also surface on that
//              service's landing page later
//
// Collection order, highest value first (all still need written approval):
//   TCL · Hisense · Segway · Meitu · Ulike · Gong cha
// =====================================================================

export const testimonialsSection = {
	enabled: true,
	eyebrow: 'In their words',
	title: 'What our clients say',
	sub: 'Named quotes from the teams we have launched in the US market.'
};

/** @type {{quote: string, name: string, role: string, company: string,
 *  image?: string, imageAlt?: string, service?: string}[]} */
export const testimonials = [];

/** Quotes for one service slug, for the service landing pages. */
export const testimonialsFor = (slug) => testimonials.filter((t) => t.service === slug);
