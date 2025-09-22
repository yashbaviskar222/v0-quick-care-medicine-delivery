-- Insert sample medicines (these will be available to all users)
INSERT INTO public.medicines (name, description, price, stock_quantity, category, requires_prescription, image_url) VALUES
('Paracetamol 500mg', 'Pain relief and fever reducer', 5.99, 100, 'Pain Relief', false, '/placeholder.svg?height=100&width=100'),
('Ibuprofen 400mg', 'Anti-inflammatory pain relief', 7.50, 80, 'Pain Relief', false, '/placeholder.svg?height=100&width=100'),
('Amoxicillin 250mg', 'Antibiotic for bacterial infections', 12.99, 50, 'Antibiotics', true, '/placeholder.svg?height=100&width=100'),
('Cetirizine 10mg', 'Antihistamine for allergies', 8.25, 60, 'Allergy', false, '/placeholder.svg?height=100&width=100'),
('Omeprazole 20mg', 'Acid reflux and heartburn relief', 15.75, 40, 'Digestive', false, '/placeholder.svg?height=100&width=100'),
('Metformin 500mg', 'Diabetes medication', 18.50, 30, 'Diabetes', true, '/placeholder.svg?height=100&width=100'),
('Lisinopril 10mg', 'Blood pressure medication', 22.00, 25, 'Cardiovascular', true, '/placeholder.svg?height=100&width=100'),
('Simvastatin 20mg', 'Cholesterol medication', 19.99, 35, 'Cardiovascular', true, '/placeholder.svg?height=100&width=100');
