import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PathAnimation from "@/components/title-about-home";
import { Avatar, AvatarGroup, AvatarIcon } from "@heroui/avatar";
import { FaStar } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TestimonialsSectionProps {
  title: string;
  description: string;
  testimonials: Array<{
    author: {
      name: string;
      handle: string;
      avatar: string;
      note: number;
    };
    text: string;
    href?: string;
  }>;
  className?: string;
}

export function TestimonialsSection({
  title,
  description,
  testimonials,
  className,
}: TestimonialsSectionProps) {
  return (
    <section
      className={cn(
        "bg-(--bg-legebluefort) text-foreground",
        "py-4 sm:py-8 md:py-10 px-0",
        className,
      )}
    >
      <div className="relative overflow-hidden mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16">
        <div className="relative z-10 w-full mx-auto max-w-6xl mt-12 mb-8 gap-3.5 text-white">
          <div className="relative flex flex-row items-center gap-4 mb-4">
            <div className="w-2 h-16 bg-white"></div>
            <div>
              <PathAnimation
                title="CONFIANCE"
                className="-top-[3rem] -left-[15.5rem]"
                fontSize="text-6xl"
              />
              <h2 className="absolute bottom-0 left-4 font-tourney text-lg md:text-2xl font-bold text-white">
                {title}
              </h2>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-[21.1%] w-[78.9%] h-[92%] bg-gradient-to-b from-[#01202f] via-[#01202f] to-[#01b3d9]"></div>

        <div className="relative z-10 w-[76%]">
          <div className="flex justify-between w-full">
            <div>
              <Card className="w-full bg-white">
                <CardHeader>
                  <CardTitle className="text-start">
                    Aidez les futurs conducteurs à choisir
                  </CardTitle>
                  <CardDescription className="text-start">
                    Votre retour nous aide à améliorer notre service et à guider
                    les autres utilisateurs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="flex flex-col gap-6 text-start">
                      <div className="grid gap-2">
                        <Label htmlFor="prenom">Prénom (ou pseudo)</Label>
                        <Input
                          id="prenom"
                          type="text"
                          placeholder="Prénom ou pseudo"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="Commentaire">Commentaire</Label>
                        </div>
                        <Textarea
                          id="Commentaire"
                          placeholder="Qu'avez-vous apprécié ? Y a-t-il un point à améliorer ?"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="evaluation">
                            Comment évaluez-vous votre expérience ?
                          </Label>
                        </div>
                        <div className="rating">
                          <input
                            type="radio"
                            name="rating-2"
                            className="mask mask-star-2 bg-(--bg-legebluemoyen)"
                            aria-label="1 star"
                          />
                          <input
                            type="radio"
                            name="rating-2"
                            className="mask mask-star-2 bg-(--bg-legebluemoyen)"
                            aria-label="2 star"
                            defaultChecked
                          />
                          <input
                            type="radio"
                            name="rating-2"
                            className="mask mask-star-2 bg-(--bg-legebluemoyen)"
                            aria-label="3 star"
                          />
                          <input
                            type="radio"
                            name="rating-2"
                            className="mask mask-star-2 bg-(--bg-legebluemoyen)"
                            aria-label="4 star"
                          />
                          <input
                            type="radio"
                            name="rating-2"
                            className="mask mask-star-2 bg-(--bg-legebluemoyen)"
                            aria-label="5 star"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button type="submit" className="bg-(--bg-legebluefort) w-full">
                    Publier mon avis
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div>
              <Carousel className="w-[30rem]">
                <CarouselContent>
                  {testimonials.map((value, index) => (
                    <CarouselItem key={index}>
                      <div className="flex flex-col justify-start items-center gap-3">
                        <div>
                          <Avatar
                            className="w-20 h-20 text-large"
                            src={`${value.author.avatar}`}
                          />
                        </div>
                        <div className="flex gap-3">
                          {Array.from({ length: value.author.note }).map(
                            (_, index) => (
                              <div key={index}>
                                <FaStar className="text-(--bg-legebluemoyen) w-4 h-4" />
                              </div>
                            ),
                          )}
                        </div>
                        <div className="text-white text-sm">
                          <p>{value.text}</p>
                        </div>
                        <div>
                          <h3 className="text-white text-xl font-semibold">
                            {value.author.name}
                          </h3>
                          <div>
                            <span className="text-(--bg-legebluecalme)">
                              {value.author.handle}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
