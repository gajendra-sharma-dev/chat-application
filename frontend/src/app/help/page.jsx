import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

function page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-400">
      <Accordion className="max-w-lg w-full">
        <AccordionItem>
          <AccordionTrigger>How to find your friend?</AccordionTrigger>
          <AccordionContent>
            you search your friend username and click chat button then a room
            create where you chat your friend
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="returns">
          <AccordionTrigger>Your friend list?</AccordionTrigger>
          <AccordionContent>
            All your friend room is shown in sidebar where you click and start
            chat with us.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="support">
          <AccordionTrigger>
            How can I contact customer support?
          </AccordionTrigger>
          <AccordionContent>
            Reach us via email, live chat, or phone. We respond within 24 hours
            during business days.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Link
        href="/dashboard"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md bg-white text-black"
      >
        back
      </Link>
    </div>
  );
}

export default page;
