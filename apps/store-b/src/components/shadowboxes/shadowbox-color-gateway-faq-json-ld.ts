/** FAQPage JSON-LD — origina-store-b/client/src/pages/shadowboxes/*ShadowboxFrames.tsx */

import type { ShadowboxGatewayColorName } from "./shadowbox-color-gateway-keys";

export function buildShadowboxColorGatewayFaqJsonLd(
  colorName: ShadowboxGatewayColorName,
  slug: string
): Record<string, unknown> {
  const base = `https://www.shadowboxframes.com/shadowboxes/colors/${slug}`;
  const faqSuffix = `${base}#faq`;

  const blocks: Record<ShadowboxGatewayColorName, Record<string, unknown>> = {
    Black: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${faqSuffix}`,
      mainEntity: [
        {
          "@type": "Question",
          "@id": `${base}#faq-best-memorabilia`,
          name: "What memorabilia looks best in black shadowbox frames?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Black shadowbox frames excel with sports jerseys (especially colorful team uniforms), military medals and ribbons, signed concert posters, vintage vinyl records, and championship memorabilia. The black border creates professional contrast that makes colorful items stand out while providing sophisticated presentation for formal achievements and awards.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-jerseys`,
          name: "Do black shadowboxes work for sports jerseys?",
          acceptedAnswer: {
            "@type": "Answer",
            text: 'Yes, black shadowboxes feature a matte-finished hardwood moulding with deep profile options up to 3.5 inches. The dark frame creates striking contrast with team colors and white numbers, making jerseys pop. Black provides professional presentation that works in man caves, home offices, and living rooms. Deep profile options accommodate folded jerseys while UV-protective acrylic prevents fabric fading.',
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-jersey-depth`,
          name: "How deep should a black shadowbox be for a folded jersey?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For folded jerseys, choose 2.5 to 3.5 inch depth shadowboxes. Standard fold requires approximately 2 inches of depth, but deeper frames allow room for mounting boards, nameplate additions, and proper spacing from the acrylic front. Extra depth also accommodates thicker fabric jerseys or multiple layers.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-mix-colors`,
          name: "Can I mix black and white shadowboxes on the same wall?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, mixing black and white shadowboxes creates dynamic gallery walls with modern contrast. Use black frames for colorful memorabilia and white frames for darker items to maximize visual impact. Maintain consistent depths and spacing for cohesive presentation. This approach works particularly well for music collections mixing colorful and monochrome album covers.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-medals-depth`,
          name: "What depth black shadowbox do I need for military medals?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Military medals typically require 1.25 to 2.5 inch depth shadowboxes. Standard service medals with ribbons fit in 1.25-1.5 inch depths. Larger medals, challenge coins, or displays combining medals with rank insignia and photos need 2-2.5 inch depths. Extra depth allows proper medal arrangement without touching the acrylic front.",
          },
        },
      ],
    },
    White: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${faqSuffix}`,
      mainEntity: [
        {
          "@type": "Question",
          "@id": `${base}#faq-signed-memorabilia`,
          name: "Are white shadowboxes good for signed memorabilia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, white shadowboxes are excellent for signed memorabilia. The clean background makes autographs stand out clearly, especially on darker items like baseballs, dark jerseys, or black-and-white photos. White frames create gallery-style presentation that emphasizes the collectible while maintaining light, contemporary aesthetics finished with a sealed, non-yellowing matte coating over hardwood.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-jersey-depth`,
          name: "What's the best depth for white shadowboxes with light-colored jerseys?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For light-colored jerseys in white shadowboxes, choose 2.5 to 3.5 inch depths. This allows sufficient space to prevent jersey touching the acrylic and creates visual separation between white fabric and white frame. Consider adding colored mat boards or backing to create contrast and prevent the monochromatic wash-out effect.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-fingerprints-dust`,
          name: "Do white shadowboxes show fingerprints or dust?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "White shadowbox frames are actually easier to maintain than black frames. Light-colored frames don't show dust as readily as dark frames. Use microfiber cloths for occasional cleaning. Professional-grade acrylic fronts are treated to resist fingerprints and are easier to clean than standard glass or plastic glazing options.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-wedding-displays`,
          name: "Can white shadowboxes be used for wedding dress displays?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, white shadowboxes work beautifully for wedding dress displays, particularly for preserving dress sections, veils, or garters with invitation cards and photos. Choose 3-3.5 inch depths for fabric items. White frames complement wedding memorabilia perfectly while creating bright, romantic displays suitable for bedrooms or dressing areas.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-vinyl-depth`,
          name: "What depth white shadowbox works for vinyl records?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Vinyl record LPs in their sleeves require 1-1.5 inch depth shadowboxes. Standard album covers are approximately 0.25 inches thick, but additional depth accommodates mounting hardware and prevents records from touching the front acrylic. White frames make colorful album artwork pop while creating modern music gallery walls.",
          },
        },
      ],
    },
    Brown: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${faqSuffix}`,
      mainEntity: [
        {
          "@type": "Question",
          "@id": `${base}#faq-best-memorabilia`,
          name: "What memorabilia looks best in brown shadowbox frames?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Brown shadowbox frames are constructed from solid hardwood in walnut, oak, and honey-toned finishes that show natural grain variation. The warm wood tones complement aged items and create nostalgic displays that honor history and heritage. Brown frames work particularly well with sepia-toned photos and historical documents.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-modern-sports`,
          name: "Do brown frames work with modern sports memorabilia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, brown frames work beautifully with both vintage and modern memorabilia. While they excel with retro items, brown frames also create warm, inviting displays for contemporary jerseys and autographs. Choose darker browns for modern items and lighter honey-oak tones for vintage pieces. The natural finish adds character without overwhelming colorful modern uniforms.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-vintage-records`,
          name: "What's the best depth brown shadowbox for vintage records?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Vintage vinyl records in their original sleeves require 1-1.5 inch depth brown shadowboxes. This accommodates the album cover thickness plus mounting hardware. For displays combining records with concert tickets or liner notes, choose 1.5-2 inch depths. Brown frames enhance the nostalgic aesthetic of classic rock, jazz, and country albums.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-modern-homes`,
          name: "Can brown shadowboxes work in modern homes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely! Brown shadowboxes complement modern interiors, especially contemporary rustic, farmhouse, and Scandinavian styles. Choose sleek profiles for modern aesthetics or wider moldings for traditional looks. Brown frames bridge vintage memorabilia with modern décor, creating eclectic gallery walls that add warmth and character to minimalist spaces.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-furniture-matching`,
          name: "How do I match brown shadowbox tones to my furniture?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Match wood undertones rather than exact colors. For red-toned furniture (cherry, mahogany), choose brown frames with warm red undertones. For golden furniture (oak, maple), select honey or amber-brown frames. For cool-toned furniture, opt for gray-brown or walnut finishes. The grain pattern and finish (matte vs. gloss) should complement your furniture style.",
          },
        },
      ],
    },
    Silver: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${faqSuffix}`,
      mainEntity: [
        {
          "@type": "Question",
          "@id": `${base}#faq-athletic-medals`,
          name: "Are silver shadowboxes best for athletic medals?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, silver shadowbox frames pair a cool-toned metallic moulding with UV-protective acrylic glazing. The metallic finish complements medal colors and creates cohesive displays when multiple medals are shown together. Silver frames enhance the prestige of Olympic medals, marathon finishers, and athletic championships while providing modern, sophisticated presentation.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-contemporary-traditional`,
          name: "What's the difference between contemporary and traditional silver finishes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Contemporary silver frames feature sleek, matte or brushed metallic finishes with clean lines and minimalist profiles. Traditional silver frames often have ornate detailing, decorative corners, and shinier polished finishes. Contemporary silver mouldings measure narrower with flat-face profiles, while traditional silver mouldings are wider with scoop or reverse-bevel edges.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-tarnish`,
          name: "Will silver shadowbox frames tarnish over time?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, modern silver shadowbox frames use sealed metallic finishes or silver-colored wood that won't tarnish. Unlike actual silver metal, these frames maintain their appearance without polishing or maintenance. UV-protective acrylic also prevents discoloration from sun exposure, ensuring long-lasting beauty for your memorabilia displays.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-mix-metallics`,
          name: "Can I mix silver shadowboxes with other metallic frames?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, silver shadowboxes pair beautifully with gold and bronze frames for multi-tiered achievement displays. Use silver for second-place finishes, gold for championships, and bronze for third place. This creates cohesive medal walls and trophy room displays that honor different achievement levels while maintaining sophisticated metallic coordination.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-corporate-awards`,
          name: "Are silver shadowboxes suitable for corporate award displays?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. Silver frames provide professional, contemporary presentation built on solid wood with a tarnish-resistant silver coating that maintains its luster under office lighting. The modern metallic finish complements office décor and creates formal displays worthy of executive spaces. Deep profiles accommodate plaques, crystal awards, and achievement documentation.",
          },
        },
      ],
    },
    Gold: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${faqSuffix}`,
      mainEntity: [
        {
          "@type": "Question",
          "@id": `${base}#faq-championship-rings`,
          name: "What depth gold shadowbox do I need for championship rings and medals?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For championship rings, choose 2.5 to 3.5 inch depth shadowboxes. Standard medals fit in 1.5-2 inch depths. Championship rings need extra depth for their height when displayed upright on ring holders. Multi-item displays combining rings, medals, and photos require 3-3.5 inch depths to accommodate multiple layers and mounting boards.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-modern-ornate`,
          name: "Should I choose modern or ornate gold finishes for my shadowbox?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Modern gold frames feature sleek, polished finishes with clean lines and a smooth metallic surface that pairs with minimalist décor. Ornate gold frames have decorative corners and traditional detailing with hand-applied patina accents on solid wood moulding. Modern gold suits athletic memorabilia while ornate gold complements lifetime achievement awards and legacy honors.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-military-medals`,
          name: "Are gold shadowboxes suitable for military medals?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, gold shadowboxes provide prestigious presentation for high military honors like Purple Hearts, Bronze Stars, and Silver Stars. The formal finish creates distinguished displays worthy of service achievements. Gold frames work especially well for retirement shadowboxes combining medals, rank insignia, photos, and service ribbons in formal military shadowbox presentations.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-team-colors`,
          name: "Can I pair gold frames with team colors in sports memorabilia displays?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. Gold frames enhance championship jerseys and work with any team color combination. The luxurious finish elevates Super Bowl jerseys, World Series memorabilia, and championship gear. Gold complements team colors without competing, creating premium displays that honor athletic excellence and championship victories.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-gold-vs-bronze`,
          name: "What's the difference between gold and bronze shadowbox frames?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Gold frames feature brighter, yellow metallic finishes that convey luxury and premium achievement. Bronze frames have darker, reddish-brown tones with antique character. Use gold for first place achievements, championships, and gold records. Bronze works well for third place finishes, vintage items, and rustic displays. Gold creates formal elegance while bronze offers warm, traditional charm.",
          },
        },
      ],
    },
    Blue: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${faqSuffix}`,
      mainEntity: [
        {
          "@type": "Question",
          "@id": `${base}#faq-nautical-memorabilia`,
          name: "Are blue shadowboxes best for nautical memorabilia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, blue shadowbox frames naturally complement nautical and coastal collections. The ocean-inspired color enhances ship models, navigation instruments, naval memorabilia, and beach vacation keepsakes. Blue frames work particularly well in coastal homes, beach houses, and rooms with nautical themes, creating cohesive displays that celebrate maritime heritage.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-school-spirit`,
          name: "Can I use blue shadowboxes for school spirit displays?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. Blue frames perfectly showcase school colors and team memorabilia for universities like Duke, UCLA, Kentucky, North Carolina, and many others. Display varsity letters, graduation photos, school jerseys, and achievement awards in frames matching your alma mater's colors. Blue shadowboxes create spirited displays that honor academic and athletic accomplishments.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-navy-vs-light`,
          name: "What's the difference between navy blue and lighter blue shadowboxes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Navy blue frames offer formal, traditional styling suited to military memorabilia, classic sports teams, and conservative décor. Lighter coastal blues provide casual, beachy aesthetics ideal for vacation memories and relaxed interiors. Navy creates sophisticated contrast while lighter blues add cheerful coastal charm. Choose based on your memorabilia type and room décor style.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-team-colors`,
          name: "Will blue shadowboxes match my team colors?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Blue frames coordinate beautifully with team color combinations. They complement silver for Cowboys displays, gold for Rams memorabilia, orange for Broncos collections, and white for numerous teams. The versatile color works with most team palettes without overwhelming primary colors. Blue shadowboxes enhance team pride while maintaining sophisticated presentation.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-why-less-common`,
          name: "Why are blue shadowboxes less common than black or brown?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Blue shadowboxes are specialty items for collectors seeking unique, distinctive displays. While black and brown suit universal applications, blue makes intentional design statements. This rarity makes blue frames ideal for creating standout displays that showcase personality and break from traditional framing. Blue shadowboxes transform ordinary memorabilia into conversation pieces.",
          },
        },
      ],
    },
    Natural: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${faqSuffix}`,
      mainEntity: [
        {
          "@type": "Question",
          "@id": `${base}#faq-vintage-memorabilia`,
          name: "Are natural wood shadowboxes best for vintage memorabilia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, natural wood frames beautifully complement vintage items, antiques, and heritage collections. The organic finish creates authentic presentations for vintage photographs, old letters, family heirlooms, and historical documents. Natural wood grain patterns add character that enhances aged memorabilia while providing timeless framing that works with period pieces from any era.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-grain-patterns`,
          name: "How much do wood grain patterns vary in natural shadowboxes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Natural wood shadowboxes showcase authentic grain variations unique to each frame. Expect visible wood patterns, color variations, and natural character marks that make every frame one-of-a-kind. Light maple woods show subtle grains while oak displays more pronounced patterns. This organic variation adds authenticity and warmth, ensuring your shadowbox is truly unique.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-eco-friendly`,
          name: "Are natural wood shadowboxes eco-friendly and sustainable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Natural wood frames offer eco-conscious framing using sustainable hardwoods with minimal processing. Clear finishes preserve wood's natural beauty without heavy stains or synthetic coatings. Many natural frames use responsibly sourced woods, making them environmentally friendly choices. Natural shadowboxes provide green framing options that align with sustainable living values.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-farmhouse-decor`,
          name: "Will natural wood shadowboxes work with my rustic farmhouse décor?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. Natural wood frames perfectly complement farmhouse, rustic, Scandinavian, and cottage décor styles. The organic finish coordinates with wood furniture, exposed beams, and natural textiles. Natural shadowboxes add warmth to modern farmhouse interiors while honoring rustic aesthetics. They work equally well in contemporary minimalist spaces seeking organic elements.",
          },
        },
        {
          "@type": "Question",
          "@id": `${base}#faq-natural-vs-stained`,
          name: "What's the difference between natural and stained wood shadowboxes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Natural wood frames feature clear finishes that showcase authentic grain patterns and wood color variations. Stained frames (like brown) use pigments to create uniform colors and hide natural variations. Choose natural for organic, one-of-a-kind character and visible grain. Select stained finishes for consistent color matching across multiple frames in gallery walls.",
          },
        },
      ],
    },
  };

  return blocks[colorName];
}
