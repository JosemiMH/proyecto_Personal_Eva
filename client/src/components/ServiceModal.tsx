import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: any;
}

const ServiceModal = ({ isOpen, onClose, service }: ServiceModalProps) => {
    const { language, t } = useLanguage();

    if (!service) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col font-poppins">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-turquoise/10 rounded-full flex items-center justify-center shrink-0">
                            <i className={`fas ${service.icon} text-turquoise text-xl`}></i>
                        </div>
                        <DialogTitle className="font-playfair text-2xl text-charcoal">
                            {typeof service.title === 'object' ? service.title[language] : service.title}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-grow pr-4">
                    <div className="space-y-6">
                        <DialogDescription className="text-base text-charcoal-light leading-relaxed">
                            {service.longDescription
                                ? (typeof service.longDescription === 'object' ? service.longDescription[language] : service.longDescription)
                                : (typeof service.description === 'object' ? service.description[language] : service.description)
                            }
                        </DialogDescription>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                                <i className="fas fa-star text-turquoise"></i>
                                {language === 'es' ? 'Características Clave' : 'Key Features'}
                            </h4>
                            <ul className="space-y-3">
                                {(typeof service.features === 'object' ?
                                    service.features[language] :
                                    service.features
                                ).map((feature: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <i className="fas fa-check text-turquoise mt-1 shrink-0"></i>
                                        <span className="text-charcoal-light">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="mt-6">
                    <Button
                        onClick={() => {
                            onClose();
                            const contactSection = document.getElementById('contact');
                            if (contactSection) {
                                contactSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className="w-full bg-turquoise hover:bg-turquoise-dark text-white font-medium py-6 text-lg"
                    >
                        {language === 'es' ? 'Solicitar Consultoría' : 'Request Consultation'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ServiceModal;
