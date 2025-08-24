import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Place {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onPlaceSelect,
  placeholder = "Search for businesses, places, or addresses...",
  className = "",
  value = "",
  onChange,
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        setIsLoading(true);
        
        const loader = new Loader({
          apiKey: 'AIzaSyDggmqBtGRr7QgniVlGsZv7cISpiJKsqxg',
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        
        if (inputRef.current) {
          autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
            types: ['establishment', 'geocode'],
            componentRestrictions: { country: 'IN' }, // India
            fields: ['place_id', 'formatted_address', 'geometry', 'name', 'types', 'business_status', 'rating', 'user_ratings_total', 'photos', 'opening_hours', 'website', 'formatted_phone_number']
          });

          // Handle place selection
          autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place && place.place_id) {
              onPlaceSelect(place);
              setInputValue(place.formatted_address || place.name || '');
              setShowSuggestions(false);
            }
          });

          // Handle input changes for custom suggestions
          inputRef.current.addEventListener('input', handleInputChange);
        }
      } catch (error) {
        console.error('Error loading Google Places:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAutocomplete();

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      if (inputRef.current) {
        inputRef.current.removeEventListener('input', handleInputChange);
      }
    };
  }, [onPlaceSelect]);

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setInputValue(value);
    onChange?.(value);
    
    if (value.length > 2) {
      // Show custom suggestions based on input
      showCustomSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const showCustomSuggestions = async (query: string) => {
    try {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      
      const request: google.maps.places.TextSearchRequest = {
        query: query,
        type: google.maps.places.PlaceType.ESTABLISHMENT,
        componentRestrictions: { country: 'IN' }
      };

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const places: Place[] = results.slice(0, 5).map(result => ({
            place_id: result.place_id || '',
            description: result.formatted_address || result.name || '',
            structured_formatting: {
              main_text: result.name || '',
              secondary_text: result.formatted_address || ''
            }
          }));
          
          setSuggestions(places);
          setShowSuggestions(true);
        }
      });
    } catch (error) {
      console.error('Error fetching custom suggestions:', error);
    }
  };

  const handleSuggestionClick = (suggestion: Place) => {
    setInputValue(suggestion.description);
    onChange?.(suggestion.description);
    setShowSuggestions(false);
    
    // Trigger place selection
    if (autocompleteRef.current) {
      const input = inputRef.current;
      if (input) {
        input.value = suggestion.description;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const handleInputFocus = () => {
    if (inputValue.length > 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange?.(e.target.value);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {!isLoading && inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              onChange?.('');
              setSuggestions([]);
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Custom Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id || index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">
                {suggestion.structured_formatting.main_text}
              </div>
              <div className="text-sm text-gray-500">
                {suggestion.structured_formatting.secondary_text}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Google Places Attribution */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        Powered by Google Places
      </div>
    </div>
  );
};

export default PlacesAutocomplete;
