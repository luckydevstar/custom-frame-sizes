/**
 * Per-color data for shadowbox color detail pages: complementary colors, FAQ schema, and copy.
 * Keys match SHADOWBOX_COLOR_METADATA (Black, White, Brown, Silver, Gold, Blue, Natural).
 */

export const COMPLEMENTARY_COLORS_MAP: Record<string, string[]> = {
  Black: ["White", "Silver", "Brown"],
  White: ["Black", "Natural", "Brown"],
  Brown: ["Natural", "Gold", "Black"],
  Silver: ["Black", "White", "Gold"],
  Gold: ["Brown", "Silver", "Black"],
  Blue: ["Silver", "White", "Black"],
  Natural: ["Brown", "White", "Gold"],
};

/** Frame materials card description by color (e.g. "rich black finishes") */
export const FRAME_MATERIALS_COPY: Record<string, string> = {
  Black: "Premium hardwood with rich black finishes for professional, modern appearance",
  White: "Premium hardwood with clean white finishes for gallery-style, contemporary presentation",
  Brown: "Premium hardwood with warm brown finishes for traditional, rustic elegance",
  Silver: "Premium hardwood with sleek silver metallic finishes for modern, sophisticated display",
  Gold: "Premium hardwood with luxurious gold finishes for formal, premium presentation",
  Blue: "Premium hardwood with distinctive blue finishes for unique, statement displays",
  Natural:
    "Premium hardwood with natural wood grain and clear finishes for organic, authentic display",
};

export interface FAQItem {
  name: string;
  text: string;
}

export const SHADOWBOX_COLOR_FAQ: Record<string, FAQItem[]> = {
  Black: [
    {
      name: "What memorabilia looks best in black shadowbox frames?",
      text: "Black shadowbox frames excel with sports jerseys (especially colorful team uniforms), military medals and ribbons, signed concert posters, vintage vinyl records, and championship memorabilia. The black border creates professional contrast that makes colorful items stand out while providing sophisticated presentation for formal achievements and awards.",
    },
    {
      name: "Do black shadowboxes work for sports jerseys?",
      text: "Yes, black shadowboxes are ideal for sports jerseys. The dark frame creates striking contrast with team colors and white numbers, making jerseys pop. Black provides professional presentation that works in man caves, home offices, and living rooms. Deep profile options accommodate folded jerseys while UV-protective acrylic prevents fabric fading.",
    },
    {
      name: "How deep should a black shadowbox be for a folded jersey?",
      text: "For folded jerseys, choose 2.5 to 3.5 inch depth shadowboxes. Standard fold requires approximately 2 inches of depth, but deeper frames allow room for mounting boards, nameplate additions, and proper spacing from the acrylic front. Extra depth also accommodates thicker fabric jerseys or multiple layers.",
    },
    {
      name: "Can I mix black and white shadowboxes on the same wall?",
      text: "Yes, mixing black and white shadowboxes creates dynamic gallery walls with modern contrast. Use black frames for colorful memorabilia and white frames for darker items to maximize visual impact. Maintain consistent depths and spacing for cohesive presentation. This approach works particularly well for music collections mixing colorful and monochrome album covers.",
    },
    {
      name: "What depth black shadowbox do I need for military medals?",
      text: "Military medals typically require 1.25 to 2.5 inch depth shadowboxes. Standard service medals with ribbons fit in 1.25-1.5 inch depths. Larger medals, challenge coins, or displays combining medals with rank insignia and photos need 2-2.5 inch depths. Extra depth allows proper medal arrangement without touching the acrylic front.",
    },
  ],
  White: [
    {
      name: "Are white shadowboxes good for signed memorabilia?",
      text: "Yes, white shadowboxes are excellent for signed memorabilia. The clean background makes autographs stand out clearly, especially on darker items like baseballs, dark jerseys, or black-and-white photos. White frames create gallery-style presentation that emphasizes the collectible while maintaining light, contemporary aesthetics perfect for modern homes.",
    },
    {
      name: "What's the best depth for white shadowboxes with light-colored jerseys?",
      text: "For light-colored jerseys in white shadowboxes, choose 2.5 to 3.5 inch depths. This allows sufficient space to prevent jersey touching the acrylic and creates visual separation between white fabric and white frame. Consider adding colored mat boards or backing to create contrast and prevent the monochromatic wash-out effect.",
    },
    {
      name: "Do white shadowboxes show fingerprints or dust?",
      text: "White shadowbox frames are actually easier to maintain than black frames. Light-colored frames don't show dust as readily as dark frames. Use microfiber cloths for occasional cleaning. Professional-grade acrylic fronts are treated to resist fingerprints and are easier to clean than standard glass or plastic glazing options.",
    },
    {
      name: "Can white shadowboxes be used for wedding dress displays?",
      text: "Yes, white shadowboxes work beautifully for wedding dress displays, particularly for preserving dress sections, veils, or garters with invitation cards and photos. Choose 3-3.5 inch depths for fabric items. White frames complement wedding memorabilia perfectly while creating bright, romantic displays suitable for bedrooms or dressing areas.",
    },
    {
      name: "What depth white shadowbox works for vinyl records?",
      text: "Vinyl record LPs in their sleeves require 1-1.5 inch depth shadowboxes. Standard album covers are approximately 0.25 inches thick, but additional depth accommodates mounting hardware and prevents records from touching the front acrylic. White frames make colorful album artwork pop while creating modern music gallery walls.",
    },
  ],
  Brown: [
    {
      name: "What memorabilia looks best in brown shadowbox frames?",
      text: "Brown shadowbox frames are ideal for vintage baseball cards, retro sports jerseys, antique photographs, family heirlooms, vintage vinyl records, and rustic memorabilia. The warm wood tones complement aged items and create nostalgic displays that honor history and heritage. Brown frames work particularly well with sepia-toned photos and historical documents.",
    },
    {
      name: "Do brown frames work with modern sports memorabilia?",
      text: "Yes, brown frames work beautifully with both vintage and modern memorabilia. While they excel with retro items, brown frames also create warm, inviting displays for contemporary jerseys and autographs. Choose darker browns for modern items and lighter honey-oak tones for vintage pieces. The natural finish adds character without overwhelming colorful modern uniforms.",
    },
    {
      name: "What's the best depth brown shadowbox for vintage records?",
      text: "Vintage vinyl records in their original sleeves require 1-1.5 inch depth brown shadowboxes. This accommodates the album cover thickness plus mounting hardware. For displays combining records with concert tickets or liner notes, choose 1.5-2 inch depths. Brown frames enhance the nostalgic aesthetic of classic rock, jazz, and country albums.",
    },
    {
      name: "Can brown shadowboxes work in modern homes?",
      text: "Absolutely! Brown shadowboxes complement modern interiors, especially contemporary rustic, farmhouse, and Scandinavian styles. Choose sleek profiles for modern aesthetics or wider moldings for traditional looks. Brown frames bridge vintage memorabilia with modern décor, creating eclectic gallery walls that add warmth and character to minimalist spaces.",
    },
    {
      name: "How do I match brown shadowbox tones to my furniture?",
      text: "Match wood undertones rather than exact colors. For red-toned furniture (cherry, mahogany), choose brown frames with warm red undertones. For golden furniture (oak, maple), select honey or amber-brown frames. For cool-toned furniture, opt for gray-brown or walnut finishes. The grain pattern and finish (matte vs. gloss) should complement your furniture style.",
    },
  ],
  Silver: [
    {
      name: "Are silver shadowboxes best for athletic medals?",
      text: "Yes, silver shadowbox frames are ideal for athletic medals and sports achievements. The metallic finish complements medal colors and creates cohesive displays when multiple medals are shown together. Silver frames enhance the prestige of Olympic medals, marathon finishers, and athletic championships while providing modern, sophisticated presentation.",
    },
    {
      name: "What's the difference between contemporary and traditional silver finishes?",
      text: "Contemporary silver frames feature sleek, matte or brushed metallic finishes with clean lines and minimalist profiles. Traditional silver frames often have ornate detailing, decorative corners, and shinier polished finishes. Contemporary silver works best for modern achievements and corporate awards, while traditional silver complements vintage medals and formal presentations.",
    },
    {
      name: "Will silver shadowbox frames tarnish over time?",
      text: "No, modern silver shadowbox frames use sealed metallic finishes or silver-colored wood that won't tarnish. Unlike actual silver metal, these frames maintain their appearance without polishing or maintenance. UV-protective acrylic also prevents discoloration from sun exposure, ensuring long-lasting beauty for your memorabilia displays.",
    },
    {
      name: "Can I mix silver shadowboxes with other metallic frames?",
      text: "Yes, silver shadowboxes pair beautifully with gold and bronze frames for multi-tiered achievement displays. Use silver for second-place finishes, gold for championships, and bronze for third place. This creates cohesive medal walls and trophy room displays that honor different achievement levels while maintaining sophisticated metallic coordination.",
    },
    {
      name: "Are silver shadowboxes suitable for corporate award displays?",
      text: "Absolutely. Silver frames provide professional, contemporary presentation perfect for corporate achievements, employee recognition awards, and business milestone certificates. The modern metallic finish complements office décor and creates formal displays worthy of executive spaces. Deep profiles accommodate plaques, crystal awards, and achievement documentation.",
    },
  ],
  Gold: [
    {
      name: "What depth gold shadowbox do I need for championship rings and medals?",
      text: "For championship rings, choose 2.5 to 3.5 inch depth shadowboxes. Standard medals fit in 1.5-2 inch depths. Championship rings need extra depth for their height when displayed upright on ring holders. Multi-item displays combining rings, medals, and photos require 3-3.5 inch depths to accommodate multiple layers and mounting boards.",
    },
    {
      name: "Should I choose modern or ornate gold finishes for my shadowbox?",
      text: "Modern gold frames feature sleek, polished finishes with clean lines perfect for contemporary spaces and recent championships. Ornate gold frames have decorative corners and traditional detailing ideal for vintage achievements, hall of fame honors, and formal displays. Modern gold suits athletic memorabilia while ornate gold complements lifetime achievement awards and legacy honors.",
    },
    {
      name: "Are gold shadowboxes suitable for military medals?",
      text: "Yes, gold shadowboxes provide prestigious presentation for high military honors like Purple Hearts, Bronze Stars, and Silver Stars. The formal finish creates distinguished displays worthy of service achievements. Gold frames work especially well for retirement shadowboxes combining medals, rank insignia, photos, and service ribbons in formal military shadow box presentations.",
    },
    {
      name: "Can I pair gold frames with team colors in sports memorabilia displays?",
      text: "Absolutely. Gold frames enhance championship jerseys and work with any team color combination. The luxurious finish elevates Super Bowl jerseys, World Series memorabilia, and championship gear. Gold complements team colors without competing, creating premium displays that honor athletic excellence and championship victories.",
    },
    {
      name: "What's the difference between gold and bronze shadowbox frames?",
      text: "Gold frames feature brighter, yellow metallic finishes that convey luxury and premium achievement. Bronze frames have darker, reddish-brown tones with antique character. Use gold for first place achievements, championships, and gold records. Bronze works well for third place finishes, vintage items, and rustic displays. Gold creates formal elegance while bronze offers warm, traditional charm.",
    },
  ],
  Blue: [
    {
      name: "Are blue shadowboxes best for nautical memorabilia?",
      text: "Yes, blue shadowbox frames naturally complement nautical and coastal collections. The ocean-inspired color enhances ship models, navigation instruments, naval memorabilia, and beach vacation keepsakes. Blue frames work particularly well in coastal homes, beach houses, and rooms with nautical themes, creating cohesive displays that celebrate maritime heritage.",
    },
    {
      name: "Can I use blue shadowboxes for school spirit displays?",
      text: "Absolutely. Blue frames perfectly showcase school colors and team memorabilia for universities like Duke, UCLA, Kentucky, North Carolina, and many others. Display varsity letters, graduation photos, school jerseys, and achievement awards in frames matching your alma mater's colors. Blue shadowboxes create spirited displays that honor academic and athletic accomplishments.",
    },
    {
      name: "What's the difference between navy blue and lighter blue shadowboxes?",
      text: "Navy blue frames offer formal, traditional styling perfect for military memorabilia, classic sports teams, and conservative décor. Lighter coastal blues provide casual, beachy aesthetics ideal for vacation memories and relaxed interiors. Navy creates sophisticated contrast while lighter blues add cheerful coastal charm. Choose based on your memorabilia type and room décor style.",
    },
    {
      name: "Will blue shadowboxes match my team colors?",
      text: "Blue frames coordinate beautifully with team color combinations. They complement silver for Cowboys displays, gold for Rams memorabilia, orange for Broncos collections, and white for numerous teams. The versatile color works with most team palettes without overwhelming primary colors. Blue shadowboxes enhance team pride while maintaining sophisticated presentation.",
    },
    {
      name: "Why are blue shadowboxes less common than black or brown?",
      text: "Blue shadowboxes are specialty items for collectors seeking unique, distinctive displays. While black and brown suit universal applications, blue makes intentional design statements. This rarity makes blue frames perfect for creating standout displays that showcase personality and break from traditional framing. Blue shadowboxes transform ordinary memorabilia into conversation pieces.",
    },
  ],
  Natural: [
    {
      name: "Are natural wood shadowboxes best for vintage memorabilia?",
      text: "Yes, natural wood frames beautifully complement vintage items, antiques, and heritage collections. The organic finish creates authentic presentations for vintage photographs, old letters, family heirlooms, and historical documents. Natural wood grain patterns add character that enhances aged memorabilia while providing timeless framing that works with period pieces from any era.",
    },
    {
      name: "How much do wood grain patterns vary in natural shadowboxes?",
      text: "Natural wood shadowboxes showcase authentic grain variations unique to each frame. Expect visible wood patterns, color variations, and natural character marks that make every frame one-of-a-kind. Light maple woods show subtle grains while oak displays more pronounced patterns. This organic variation adds authenticity and warmth, ensuring your shadowbox is truly unique.",
    },
    {
      name: "Are natural wood shadowboxes eco-friendly and sustainable?",
      text: "Natural wood frames offer eco-conscious framing using sustainable hardwoods with minimal processing. Clear finishes preserve wood's natural beauty without heavy stains or synthetic coatings. Many natural frames use responsibly sourced woods, making them environmentally friendly choices. Natural shadowboxes provide green framing options that align with sustainable living values.",
    },
    {
      name: "Will natural wood shadowboxes work with my rustic farmhouse décor?",
      text: "Absolutely. Natural wood frames perfectly complement farmhouse, rustic, Scandinavian, and cottage décor styles. The organic finish coordinates with wood furniture, exposed beams, and natural textiles. Natural shadowboxes add warmth to modern farmhouse interiors while honoring rustic aesthetics. They work equally well in contemporary minimalist spaces seeking organic elements.",
    },
    {
      name: "What's the difference between natural and stained wood shadowboxes?",
      text: "Natural wood frames feature clear finishes that showcase authentic grain patterns and wood color variations. Stained frames (like brown) use pigments to create uniform colors and hide natural variations. Choose natural for organic, one-of-a-kind character and visible grain. Select stained finishes for consistent color matching across multiple frames in gallery walls.",
    },
  ],
};
