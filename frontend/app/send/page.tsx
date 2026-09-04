import LocationPickerModal from '@/components/ui/LocationPickerModal';
import {
  ArrowLeft, Bell, MapPin, Navigation, Package, Bike, Car, Truck,
  ChevronRight, Plus, Minus, Info, ArrowRight, ShieldCheck, Clock, Calendar
} from 'lucide-react';

function SendParcelRouteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pickupLoc, setPickupLoc] = useState(searchParams.get('origin') || 'Anna Nagar, Chennai');
  const [deliveryLoc, setDeliveryLoc] = useState(searchParams.get('dest') || 'T. Nagar, Chennai');
  const [parcelType, setParcelType] = useState('1 kg • Document');
  const [selectedOption, setSelectedOption] = useState<'express' | 'standard' | 'large'>('express');

  // Location Picker Modal States
  const [activePickerTarget, setActivePickerTarget] = useState<'pickup' | 'delivery' | null>(null);

  // Pickup & Dropoff Time Window States
  const [pickupTime, setPickupTime] = useState('Now / Immediate');
  const [dropoffTime, setDropoffTime] = useState('Express Same-Day (Within 3 hrs)');
  const [customPickupTime, setCustomPickupTime] = useState('');
  const [customDropoffTime, setCustomDropoffTime] = useState('');

  const pickupTimeSlots = [
    { id: 'Now / Immediate', label: '⚡ Immediate / Now' },
    { id: 'Morning (8 AM - 12 PM)', label: '🌅 Morning (8 AM - 12 PM)' },
    { id: 'Afternoon (12 PM - 4 PM)', label: '☀️ Afternoon (12 PM - 4 PM)' },
    { id: 'Evening (4 PM - 8 PM)', label: '🌆 Evening (4 PM - 8 PM)' },
    { id: 'Custom', label: '📅 Custom Time' },
  ];

  const dropoffTimeSlots = [
    { id: 'Express Same-Day (Within 3 hrs)', label: '⚡ Same-Day Express (Within 3 hrs)' },
    { id: 'Today Evening (by 8 PM)', label: '🌇 Today Evening (by 8 PM)' },
    { id: 'Tomorrow Morning (by 10 AM)', label: '🌅 Tomorrow Morning (by 10 AM)' },
    { id: 'Flexible (Within 24 hrs)', label: '📦 Flexible (Within 24 hrs)' },
    { id: 'Custom', label: '📅 Custom Drop Time' },
  ];

  const deliveryOptions = [
    {
      id: 'express',
      title: 'Express ⚡',
      priceRange: '₹80 – ₹120',
      description: 'Fastest delivery • Same day',
      eta: 'ETA 1-2 hours',
      icon: Bike,
    },
    {
      id: 'standard',
      title: 'Standard',
      priceRange: '₹60 – ₹90',
      description: 'Cost effective • Reliable',
      eta: 'ETA 3-5 hours',
      icon: Car,
    },
    {
      id: 'large',
      title: 'Large Parcel',
      priceRange: '₹150 – ₹300',
      description: 'For heavier items',
      eta: 'ETA 4-8 hours',
      icon: Truck,
    },
  ];

  const activeOptionObj = deliveryOptions.find(o => o.id === selectedOption) || deliveryOptions[0];

  const handleProceed = () => {
    const finalPickupTime = pickupTime === 'Custom' ? customPickupTime || 'Custom Specified Time' : pickupTime;
    const finalDropoffTime = dropoffTime === 'Custom' ? customDropoffTime || 'Custom Specified Time' : dropoffTime;

    const query = new URLSearchParams({
      origin: pickupLoc,
      destination: deliveryLoc,
      pickupTime: finalPickupTime,
      dropoffTime: finalDropoffTime,
      option: selectedOption,
      fare: activeOptionObj.priceRange
    }).toString();
    router.push(`/send/parcel-details?${query}`);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f8fafc] pb-28 font-sans text-slate-900 animate-in fade-in select-none">
      
      {/* 1. TOP NAV HEADER */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur px-4 py-3 border-b border-slate-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#002b5c] text-white font-extrabold flex items-center justify-center text-base">
              R
            </div>
            <div>
              <div className="font-extrabold text-xs tracking-wide text-[#002b5c] leading-tight">RIDEEL</div>
              <div className="text-[8px] font-bold text-slate-400 tracking-wider uppercase">
                PEOPLE • PARCELS • POSSIBILITIES
              </div>
            </div>
          </div>
        </div>

        <div className="relative cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
            <Bell className="w-4 h-4" />
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8px] font-black flex items-center justify-center border border-white">
            3
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* 2. TITLE */}
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Send a Parcel</h1>
          <p className="text-xs text-slate-500 font-medium">Select exact pickup, dropoff & time windows</p>
        </div>

        {/* 3. INTERACTIVE MAP BOX WITH ROUTE LINE */}
        <div className="relative w-full h-52 bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200/80">
          <iframe
            title="Route Map Preview"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(pickupLoc + ' to ' + deliveryLoc)}&output=embed`}
            className="w-full h-full opacity-80"
          />

          {/* SVG Overlay Route Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 90 50 Q 150 110 210 140"
              fill="none"
              stroke="#002b5c"
              strokeWidth="4"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
          </svg>

          {/* Pickup Marker Box */}
          <div className="absolute left-6 top-4 bg-white/95 backdrop-blur rounded-xl shadow-lg px-3 py-1.5 border border-slate-200 flex items-center gap-2 animate-bounce">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <div className="text-[10px] leading-tight max-w-[120px]">
              <span className="text-slate-400 font-bold block text-[8px]">Pickup</span>
              <span className="font-extrabold text-slate-900 truncate block">{pickupLoc.split(',')[0]}</span>
            </div>
          </div>

          {/* Delivery Marker Box */}
          <div className="absolute right-6 bottom-4 bg-white/95 backdrop-blur rounded-xl shadow-lg px-3 py-1.5 border border-slate-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <div className="text-[10px] leading-tight max-w-[120px]">
              <span className="text-slate-400 font-bold block text-[8px]">Dropoff</span>
              <span className="font-extrabold text-slate-900 truncate block">{deliveryLoc.split(',')[0]}</span>
            </div>
          </div>
        </div>

        {/* 4. EXACT PICKUP & DROPOFF ADDRESS CARD */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
          {/* Exact Pickup Selection */}
          <div 
            onClick={() => setActivePickerTarget('pickup')}
            className="flex items-center justify-between cursor-pointer hover:bg-blue-50/50 p-2 rounded-2xl transition group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                    EXACT PICKUP LOCATION
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Change (GPS/Map)
                  </span>
                </div>
                <div className="font-black text-xs text-slate-900 truncate mt-0.5 group-hover:text-[#002b5c]">
                  {pickupLoc}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100"></div>

          {/* Exact Dropoff Selection */}
          <div 
            onClick={() => setActivePickerTarget('delivery')}
            className="flex items-center justify-between cursor-pointer hover:bg-rose-50/50 p-2 rounded-2xl transition group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full border-2 border-rose-500 bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">
                    EXACT DROPOFF LOCATION
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Change (GPS/Map)
                  </span>
                </div>
                <div className="font-black text-xs text-slate-900 truncate mt-0.5 group-hover:text-[#002b5c]">
                  {deliveryLoc}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100"></div>

          {/* Parcel Specs */}
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Parcel Details</span>
                <input
                  type="text"
                  value={parcelType}
                  onChange={(e) => setParcelType(e.target.value)}
                  className="font-extrabold text-xs text-slate-900 bg-transparent focus:outline-none w-full"
                />
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>
        </div>

        {/* 5. PICKUP TIME WINDOW CARD */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#002b5c]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Select Pickup Time Window
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {pickupTimeSlots.map((slot) => {
              const isSelected = pickupTime === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setPickupTime(slot.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                    isSelected
                      ? 'border-[#002b5c] bg-blue-50/50 text-[#002b5c] ring-1 ring-[#002b5c]/20'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate">{slot.label}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#002b5c]"></span>}
                </button>
              );
            })}
          </div>

          {pickupTime === 'Custom' && (
            <div className="pt-1">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">
                Enter Custom Pickup Time:
              </label>
              <input
                type="time"
                value={customPickupTime}
                onChange={(e) => setCustomPickupTime(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#002b5c]"
              />
            </div>
          )}
        </div>

        {/* 6. EXPECTED DROPOFF / DELIVERY TIME WINDOW CARD */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Select Expected Dropoff / Delivery Time
            </h2>
          </div>

          <div className="space-y-2">
            {dropoffTimeSlots.map((slot) => {
              const isSelected = dropoffTime === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setDropoffTime(slot.id)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 ring-1 ring-emerald-600/20'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate">{slot.label}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                </button>
              );
            })}
          </div>

          {dropoffTime === 'Custom' && (
            <div className="pt-1">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">
                Enter Custom Dropoff Time:
              </label>
              <input
                type="datetime-local"
                value={customDropoffTime}
                onChange={(e) => setCustomDropoffTime(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          )}
        </div>

        {/* LOCATION PICKER MODAL INSTANCE */}
        <LocationPickerModal
          isOpen={activePickerTarget !== null}
          onClose={() => setActivePickerTarget(null)}
          title={activePickerTarget === 'pickup' ? 'Select Exact Pickup Location' : 'Select Exact Dropoff Location'}
          onSelectLocation={(loc) => {
            const formatted = loc.fullAddress || (loc.city ? `${loc.name}, ${loc.city}` : loc.name);
            if (activePickerTarget === 'pickup') {
              setPickupLoc(formatted);
            } else if (activePickerTarget === 'delivery') {
              setDeliveryLoc(formatted);
            }
          }}
          initialValue={activePickerTarget === 'pickup' ? pickupLoc : deliveryLoc}
        />

        {/* 5. CHOOSE A DELIVERY OPTION */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#0f172a]">Choose a delivery option</h2>
            <span className="text-xs font-bold text-[#002b5c] cursor-pointer hover:underline">See all &gt;</span>
          </div>

          <div className="space-y-2">
            {deliveryOptions.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = selectedOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id as any)}
                  className={`bg-white rounded-2xl p-3.5 shadow-xs border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#002b5c] ring-2 ring-[#002b5c]/10 bg-blue-50/20'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#002b5c] text-white' : 'bg-slate-100 text-slate-700'}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900">{opt.title}</span>
                        <span className="text-xs font-black text-slate-900">{opt.priceRange}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <span>{opt.description}</span>
                        <span>•</span>
                        <span>{opt.eta}</span>
                      </div>
                    </div>
                  </div>

                  {/* Radio Indicator */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#002b5c] bg-white' : 'border-slate-300'}`}>
                    {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#002b5c]"></span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 6. STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3.5 flex items-center justify-between z-50 shadow-xl">
        <div>
          <div className="text-base font-black text-[#0f172a] leading-tight">
            {activeOptionObj.priceRange}
          </div>
          <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
            <span>Estimated fare</span>
            <Info className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        <button
          onClick={handleProceed}
          className="bg-[#002b5c] hover:bg-[#001f44] text-white px-7 py-3.5 rounded-2xl font-extrabold text-xs shadow-md transition flex items-center gap-2"
        >
          <span>Proceed</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

export default function SendParcelRoutePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-slate-500">Loading route settings...</div>}>
      <SendParcelRouteContent />
    </Suspense>
  );
}
