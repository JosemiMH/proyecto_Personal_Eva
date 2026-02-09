import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Service } from "@/types";

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
}

const ServiceModal = ({ isOpen, onClose, service }: ServiceModalProps) => {
    const { language } = useLanguage();

    if (!service) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col font-poppins p-0 gap-0 bg-white border-none shadow-2xl z-[60] overflow-hidden">
                <div className="bg-gradient-to-r from-turquoise/10 to-transparent p-6 md:p-8 flex items-center gap-6 border-b border-gray-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-turquoise">
                        <i className={`fas ${service.icon} text-2xl`}></i>
                    </div>
                    <div>
                        <DialogTitle className="font-playfair text-2xl md:text-3xl font-bold text-charcoal">
                            {service.title[language]}
                        </DialogTitle>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto bg-white">
                    <div className="p-6 md:p-8 space-y-6">
                        <DialogDescription className="text-base text-charcoal-light leading-relaxed">
                            {service.longDescription
                                ? service.longDescription[language]
                                : service.description[language]
                            }
                        </DialogDescription>

                        <div className="bg-gray-50/80 p-6 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-charcoal mb-4 flex items-center gap-2 font-playfair text-lg">
                                <i className="fas fa-star text-turquoise"></i>
                                {language === 'es' ? 'Características Clave' : 'Key Features'}
                            </h4>
                            <ul className="space-y-3">
                                {service.features[language].map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-turquoise shrink-0"></div>
                                        <span className="text-charcoal-light">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <Button
                        onClick={() => {
                            onClose();
                            const contactSection = document.getElementById('contact');
                            if (contactSection) {
                                contactSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className="w-full bg-turquoise hover:bg-turquoise-dark text-white font-medium py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        {language === 'es' ? 'Solicitar Consultoría' : 'Request Consultation'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ServiceModal;
