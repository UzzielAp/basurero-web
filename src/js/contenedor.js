const basureros = [
    { id: 1, lleno: false, sensorFuego: false, enUso: true, encendido: true, peso: 5.2 },
    { id: 2, lleno: true, sensorFuego: false, enUso: false, encendido: true, peso: 10.8 },
    { id: 3, lleno: false, sensorFuego: true, enUso: false, encendido: false, peso: 2.3 },
];

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const closeModal = document.getElementById('close-modal');

document.querySelectorAll('.eco-primary, .eco-secondary, .eco-accent').forEach((el, index) => {
    el.addEventListener('click', () => showModal(basureros[index]));
});

closeModal.addEventListener('click', () => modal.classList.add('hidden'));

function showModal(basurero) {
    modalTitle.textContent = `Información del Basurero ${basurero.id}`;
    modalContent.innerHTML = `
        <div class="space-y-4 mt-4">
            <div class="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <span class="font-medium">Lleno:</span>
                <div class="w-6 h-6 rounded-full ${basurero.lleno ? 'bg-red-500' : 'bg-green-500'}"></div>
            </div>
            <div class="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <span class="font-medium">Sensor de fuego:</span>
                <div class="w-6 h-6 rounded-full ${basurero.sensorFuego ? 'bg-red-500' : 'bg-green-500'}"></div>
            </div>
            <div class="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <span class="font-medium">En uso:</span>
                <div class="w-6 h-6 rounded-full ${basurero.enUso ? 'bg-green-500' : 'bg-gray-300'}"></div>
            </div>
            <div class="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <span class="font-medium">Encendido:</span>
                <div class="w-6 h-6 rounded-full ${basurero.encendido ? 'bg-green-500' : 'bg-gray-300'}"></div>
            </div>
            <div class="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <span class="font-medium">Peso:</span>
                <span class="text-lg font-semibold text-green-600">${basurero.peso} kg</span>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
}