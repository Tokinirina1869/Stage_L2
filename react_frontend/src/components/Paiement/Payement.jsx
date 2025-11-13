import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControlLabel, Checkbox, Button, MenuItem, Box, Divider,
  TableContainer, TableHead, TableBody, TableCell, TableRow, Paper, Table as MuiTable } from '@mui/material';
import { Col, Row, Form } from 'react-bootstrap';
import { FaEdit, FaMoneyCheckAlt, FaTimes, FaTrash, FaBookOpen, FaReceipt, FaFileInvoice, FaMoneyBill, FaIdCard, FaPen } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MonetizationOn } from '@mui/icons-material';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CarteEcolage from './CarteEcolage';
import { Calendar, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import framer-motion
jsPDF.API.autoTable = autoTable;

const monthOptions = [
  'Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'
];
const url = 'http://localhost:8000/api';

const initialPayment = {
  no_paie: '', no_inscrit: '', matricule: '', idfrais: '',nomfraispayés:'',
  datepaie: '', modepaie: '', montantpaie: 0, nomFrais: [], tuitionMonths: []
};

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 2
    }
  }
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 2
    }
  }
};

const buttonHover = {
  scale: 1.02,
  transition: { duration: 2 }
};

const buttonTap = {
  scale: 0.98
};

function PaymentPage() {
  const [paymentDetails, setPaymentDetails] = useState(initialPayment);
  const [listeFrais, setListeFrais] = useState([]);
  const [listePaie, setListePaie] = useState([]);
  const [listeInsc, setListeInsc] = useState([]);
  const [modalPaie, setModalPaie] = useState(false);
  const [selectedPaie, setSelectedPaie] = useState(null);

  const [modalCarteOpen, setModalCarteOpen] = useState(false);
  const [selectedMatricule, setSelectedMatricule] = useState('');

  const openCarte = (matricule) => {
    setSelectedMatricule(matricule);
    setModalCarteOpen(true);
  };
  const closeCarte = () => setModalCarteOpen(false);

  // ---------------- Data Loading ----------------
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [inscRes, fraisRes, paieRes, noPaiesRes] = await Promise.all([
          axios.get(`${url}/inscriptions`),
          axios.get(`${url}/frais`),
          axios.get(`${url}/listepaiement`),
          axios.get(`${url}/no_paiement`)
        ]);
        setListeInsc(inscRes.data);
        setListeFrais(fraisRes.data);
        setListePaie(paieRes.data.data);
        updatePayment({ no_paie: noPaiesRes.data.no_paie });
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  // ---------------- Utils ----------------
  const resetForm = () => setPaymentDetails(initialPayment);
  const openModal = () => setModalPaie(true);
  const closeModal = () => {
    setModalPaie(false);
    setSelectedPaie(null);
    resetForm();
  }
  const updatePayment = (changes) => setPaymentDetails(prev => ({ ...prev, ...changes }));

  useEffect(() => {
    if (paymentDetails.matricule) {
      const inscriptionsAssociees = listeInsc.filter(i => 
        i.matricule === paymentDetails.matricule
      );

      if (inscriptionsAssociees.length === 1) {
        updatePayment({ no_inscrit: inscriptionsAssociees[0].no_inscrit });
      } else if (inscriptionsAssociees.length > 1) {
        const currentNoInscrit = paymentDetails.no_inscrit;
        if (!inscriptionsAssociees.some(i => i.no_inscrit === currentNoInscrit)) {
          updatePayment({ no_inscrit: '' }); 
        }
      }
    } 
    else if (paymentDetails.no_inscrit !== '') {
      updatePayment({ no_inscrit: '' });
    }
  }, [paymentDetails.matricule, listeInsc, paymentDetails.no_inscrit]);

  // ---------------- Frais / Mois ----------------
  const handleFraisChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value);

    const ids = listeFrais.filter(f => selected.includes(f.nomfrais)).map(f => f.idfrais);
    
    const isTuitionSelected = selected.some(f => f.toLowerCase().includes('ecolage'));

    updatePayment({
      nomFrais: selected,
      idfrais: ids.join(","),
      tuitionMonths: isTuitionSelected ? paymentDetails.tuitionMonths : []
    });
  };

  const handleTuitionMonthCheck = (month) => {
    const months = paymentDetails.tuitionMonths.includes(month)
      ? paymentDetails.tuitionMonths.filter(m => m !== month)
      : [...paymentDetails.tuitionMonths, month];
    updatePayment({ tuitionMonths: months });
  };

  // ---------------- Montant automatique ----------------
  useEffect(() => {
    const total = paymentDetails.nomFrais.reduce((sum, nom) => {
      const f = listeFrais.find(f => f.nomfrais === nom);
      if (!f) return sum;
      const isTuition = f.nomfrais.toLowerCase().includes('ecolage');
      const amount = f.montant || 0;
      return sum + (isTuition ? amount * paymentDetails.tuitionMonths.length : amount);
    }, 0);
    setPaymentDetails(prev => ({ ...prev, montantpaie: total }));
  }, [paymentDetails.nomFrais, paymentDetails.tuitionMonths, listeFrais]);

  // ---------------- CRUD ----------------
  const fetchPaie = async () => {
    try {
      const res = await axios.get(`${url}/listepaiement`);
      setListePaie(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitPaie = async (e) => {
    e.preventDefault();

    if (!paymentDetails.nomFrais.length)
      return alert("⚠️ Veuillez sélectionner au moins un frais !");

    if (
      paymentDetails.nomFrais.some(f => f.toLowerCase().includes('ecolage')) &&
      !paymentDetails.tuitionMonths.length
    ) {
      return alert("⚠️ Veuillez sélectionner au moins un mois pour l'écolage !");
    }

    const matricule = paymentDetails.matricule;
    const fraisEcolage = paymentDetails.nomFrais.find(f =>
      f.toLowerCase().includes('ecolage')
    );

    if (paymentDetails.nomFrais.some(f => f.toLowerCase().includes('ecolage'))) {
      const matricule = paymentDetails.matricule;
      const fraisEcolageActuel = paymentDetails.nomFrais.find(f => f.toLowerCase().includes('ecolage'));

      const paiementsEcolageExistants = listePaie.filter(p =>
        p.matricule === matricule &&
        p.nomfraispayés &&
        p.nomfraispayés.toLowerCase().includes('ecolage')
      );

      if (paiementsEcolageExistants.length > 0) {
        const ecolagesExistants = paiementsEcolageExistants
          .map(p => {
            const match = p.nomfraispayés.match(/Ecolage\s+([A-Za-zéèêîôûïëç ]+)/);
            return match ? match[1].trim() : "";
          })
          .filter(Boolean);

        const niveauActuel = fraisEcolageActuel.toLowerCase().replace("écolage", "").trim();
        const conflit = ecolagesExistants.some(e => !niveauActuel.includes(e.toLowerCase()));

        if (conflit) {
          Swal.fire({
            icon: 'error',
            title: 'Écolage non autorisé',
            html: ` ⚠️ Cet élève a déjà payé un écolage différent :<br>
              <b>${ecolagesExistants.join(", ")}</b>.<br><br>
              Vous ne pouvez pas lui attribuer <b>${fraisEcolageActuel}</b>.`,
            background: '#1e1e2f',
            color: 'white',
            confirmButtonColor: '#d33'
          });
          return;
        }
      }
    }

    if (fraisEcolage) {
      const paiementsEcolage = listePaie.filter(p =>
        p.matricule === matricule &&
        p.nomfraispayés?.toLowerCase().includes('ecolage')
      );

      const moisDejaPayes = paiementsEcolage.flatMap(p => {
        const match = p.nomfraispayés.match(/\((.*?)\)/);
        return match ? match[1].split(',').map(m => m.trim()) : [];
      });

      const doublons = paymentDetails.tuitionMonths.filter(m =>
        moisDejaPayes.includes(m)
      );

      if (doublons.length > 0) {
        return Swal.fire({
          icon: 'warning',
          title: 'Mois déjà payé(s)',
          html: `⚠️ Le(s) mois suivant(s) ont déjà été payé(s) pour ce matricule :<br><b>${doublons.join(', ')}</b>`,
          background: '#1e1e2f',
          color: 'white',
          confirmButtonColor: '#d33'
        });
      }
    }

    try {
      const monthOrder = [
        'Janvier','Février','Mars','Avril','Mai','Juin',
        'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
      ];

      const nomFraisPayes = paymentDetails.nomFrais.map(frais => {
        if (frais.toLowerCase().includes('ecolage')) {
          const sortedMonths = [...paymentDetails.tuitionMonths].sort(
            (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
          );
          return `${frais} (${sortedMonths.join(', ')})`;
        }
        return frais;
      }).join(', ');

      const payload = {
        ...paymentDetails,
        nomfraispayés: nomFraisPayes,
        idfrais: paymentDetails.idfrais
          ? (Array.isArray(paymentDetails.idfrais)
              ? paymentDetails.idfrais.join(',')
              : paymentDetails.idfrais)
          : ''
      };

      await axios.post(`${url}/addpaiement`, payload);

      const noPaieRes = await axios.get(`${url}/no_paiement`);
      updatePayment({ no_paie: noPaieRes.data.no_paie });

      Swal.fire({
        icon: 'success',
        title: 'Paiement ajouté',
        background: '#1e1e2f',
        color: 'white',
        text: `Le paiement de ${paymentDetails.personne?.nom || ''} a été enregistré avec succès.`,
        timer: 2000,
        showConfirmButton: false,
        position: "bottom",
        toast: true
      });

      fetchPaie();

      setPaymentDetails(() => ({
        ...initialPayment,
        no_paie: noPaieRes.data.no_paie
      }));

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: `Impossible d'ajouter le paiement : ${JSON.stringify(err.response?.data?.errors || err.message)}`
      });
    }
  };

  const handleEditPaie = async (e) => {
    e.preventDefault();
    if (!selectedPaie) return;

    if (
      paymentDetails.nomFrais.some(f => f.toLowerCase().includes('ecolage')) &&
      !paymentDetails.tuitionMonths.length
    ) {
      return alert("⚠️ Veuillez sélectionner au moins un mois pour l'écolage !");
    }

    try {
      const monthOrder = [
        'Janvier','Février','Mars','Avril','Mai','Juin',
        'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
      ];

      const nomFraisPayes = paymentDetails.nomFrais.map(frais => {
        if (frais.toLowerCase().includes('ecolage')) {
          const sortedMonths = [...paymentDetails.tuitionMonths].sort(
            (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
          );
          return `${frais} (${sortedMonths.join(', ')})`;
        }
        return frais;
      }).join(', ');

      const formattedDetails = {
        ...paymentDetails,
        nomfraispayés: nomFraisPayes,
        idfrais: Array.isArray(paymentDetails.idfrais)
          ? paymentDetails.idfrais.join(',')
          : paymentDetails.idfrais
      };

      await axios.put(`${url}/updatepaiement/${selectedPaie.no_paie}`, formattedDetails);

      Swal.fire({
        icon: 'success',
        title: 'Modification Paiement',
        text: `Le paiement de ${paymentDetails.matricule || ''} a été modifié avec succès !`,
        timer: 2000,
        showConfirmButton: false,
        position: 'bottom',
        background: 'gray',
        color: 'white',
        toast: true,
      });

      closeModal();
      fetchPaie();
      
      const noPaieRes = await axios.get(`${url}/no_paiement`);
      updatePayment({ no_paie: noPaieRes.data.no_paie });

    } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: `Impossible de modifier le paiement : ${JSON.stringify(err.response?.data?.errors || err.message)}`
        });
    }
  };

  const handleDeletePaie = async (no_paie) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce paiement ?")) return;
    try {
      await axios.delete(`${url}/deletepaiement/${no_paie}`);
      Swal.fire({
        icon: 'success',
        title: 'Supression de Paiement',
        text:  `Le paiement de ${paymentDetails.matricule || ''} a supprimé avec succès !`,
        timer: 2000,
        background: 'gray',
        color: 'white',
        showConfirmButton: false,
        position: 'bottom',
        backgroundPosition: 'center',
        toast: true,
      });
      fetchPaie();
    } 
    catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: `Impossible d'ajouter le paiement : ${JSON.stringify(err.response?.data?.errors || err.message)}`
      });
    }
  };

  const handleSelectedPaie = (paie) => {
    setSelectedPaie(paie);
    
    const fraisData = Array.isArray(paie.frais_associes) ? paie.frais_associes : paie.nomfrais || [];
    const monthsData = Array.isArray(paie.mois_paies) ? paie.mois_paies.map(m => m.nommois) : paie.tuitionMonths || [];

    updatePayment({
      no_paie: paie.no_paie || '',
      no_inscrit: paie.no_inscrit || '',
      matricule: paie.matricule || '',
      datepaie: paie.datepaie || '',
      montantpaie: paie.montantpaie || 0,
      modepaie: paie.modepaie || '',
      nomFrais: Array.isArray(fraisData) ? fraisData.map(f => f.nomfrais || f) : [],
      idfrais: Array.isArray(fraisData) ? fraisData.map(f => f.idfrais || f).join(',') : '',
      tuitionMonths: monthsData
    });
    openModal();
  };

  const safeNumber = (v) => (typeof v === 'number' && !isNaN(v) ? v : 0);

  const calculateReste = (paiement) => {
      if (paiement.frais_associes && Array.isArray(paiement.frais_associes)) {
          
          let totalFraisDues = 0;
          let monthsCount = Array.isArray(paiement.mois_paies) ? paiement.mois_paies.length : 0;

          if (monthsCount === 0 && paiement.nomfraispayés) {
              const matchMonths = paiement.nomfraispayés.match(/\(([^)]+)\)/);
              if (matchMonths && matchMonths[1]) {
                  monthsCount = matchMonths[1].split(',').length;
              }
          }
          
          totalFraisDues = paiement.frais_associes.reduce((sum, f) => {
              const nomFrais = f.nomfrais || '';
              const isTuition = nomFrais.toLowerCase().includes('écolage') || nomFrais.toLowerCase().includes('ecolage');
              const amount = safeNumber(f.montant);
              return sum + (isTuition ? amount * monthsCount : amount); 
          }, 0);

          const montantPaye = safeNumber(paiement.montantpaie);
          const resteCalcule = totalFraisDues - montantPaye;
          
          console.log(`Paiement ${paiement.no_paie}: Total Dû: ${totalFraisDues}, Montant Payé: ${montantPaye}, Reste: ${resteCalcule}`);

          return resteCalcule;
      }
      
      const fraisAssociesNoms = paiement.nomFrais || [];
      if (!fraisAssociesNoms.length) return 0;

      const monthsCountForm = (paiement.tuitionMonths?.length || 0);

      const totalFraisDuesForm = fraisAssociesNoms.reduce((sum, nom) => {
          const f = listeFrais.find(f => f.nomfrais === nom);
          if (!f) return sum;
          const isTuition = f.nomfrais.toLowerCase().includes('écolage') || f.nomfrais.toLowerCase().includes('ecolage');
          const amount = safeNumber(f.montant);
          
          return sum + (isTuition ? amount * monthsCountForm : amount);
      }, 0);

      return totalFraisDuesForm - safeNumber(paiement.montantpaie);
  };

  const calculateResteSafe = (paiement) => Math.max(calculateReste(paiement), 0);

  const buttonStyle = (color) => ({
    padding: '10px 30px', borderRadius: '8px', fontWeight: 'bold',
    color: '#fff', textTransform: 'none', backgroundColor: color,
    '&:hover': { transform: 'translateY(-2px)', backgroundColor: color }
  });

  const tableHeaders = [
    { title: 'N° Paiement', width: 120 },
    { title: 'N° Matricule', width: 120 },
    { title: 'N° Inscription', width: 110 },
    { title: 'Nom et Prénom', width: 180 },
    { title: 'Date de Paiement', width: 150 },
    { title: 'Montant Payé (Ar)', width: 150 },
    { title: 'Reste (Ar)', width: 120 },
    { title: 'Mode de Paiement', width: 150 },
    { title: 'Frais Payés', width: 200 },
    { title: 'Actions', width: 300 },
  ];

  const generateReceipt = (paiement) => {
    try {
      console.log('[generateReceipt] paiement reçu:', paiement);

      let reste = 0;
      try {
        reste = Math.max(safeNumber(calculateReste(paiement)), 0);
      } catch (err) {
        console.warn('Erreur calculateReste:', err);
        reste = 0;
      }
      console.log('[generateReceipt] reste calculé:', reste);

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const lineHeight = 8;
      let currentY = 20;

      try {
        const logo = new Image();
        logo.src = "/cfp.png";
        doc.addImage(logo, "PNG", pageWidth / 2 - 30, 15, 60, 40); 
      } catch (e) {
        console.warn("Logo non trouvé, ignoré.", e);
      }

      currentY += 40;
      doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(0, 102, 204);
      doc.text("Reçu de Paiement", pageWidth / 2, currentY, { align: "center" });

      doc.setFontSize(11); doc.setTextColor(60, 60, 60);
      doc.text("Établissement Scolaire Laura Vicuna Anjarasoa Ankofafa", pageWidth / 2, currentY + 8, { align: "center" });
      doc.text("Adresse : Ankofafa, Fianarantsoa - Madagascar", pageWidth / 2, currentY + 14, { align: "center" });
      doc.text("Contact : +261 32 439 51 | Adresse-mail: cfplv@gmail.com", pageWidth / 2, currentY + 20, { align: "center" });

      currentY += 35;
      doc.setFontSize(13); doc.setFont("helvetica", "bold");
      doc.text("Détails du Paiement :", margin, currentY);

      currentY += lineHeight;
      doc.setFontSize(12); doc.setFont("helvetica", "normal");
      doc.text(`N° Paiement : ${paiement.no_paie || ''}`, margin, currentY);
      currentY += lineHeight;
      doc.text(`Nom : ${paiement.personne?.nom || ''} ${paiement.personne?.prenom || ''}`, margin, currentY);
      currentY += lineHeight;
      doc.text(`N° Matricule : ${paiement.matricule || ''}`, margin, currentY);
      doc.text(`N° Inscription : ${paiement.no_inscrit || ''}`, margin + 100, currentY);
      currentY += lineHeight;
      doc.text(`Date : ${paiement.datepaie || ''}`, margin, currentY);
      doc.text(`Mode : ${paiement.modepaie || ''}`, margin + 100, currentY);

      let monthsText = '';
      if (paiement.nomfraispayés) {
          const matchMonths = paiement.nomfraispayés.match(/\(([^)]+)\)/);
          if (matchMonths && matchMonths[1]) {
              monthsText = matchMonths[1];
          }
      }

      if (monthsText) {
            currentY += lineHeight;
            doc.setFont("helvetica", "bold");
            doc.text(`Mois Payé(s) :`, margin, currentY);
            
            doc.setFont("helvetica", "normal");
            const startXValue = margin + 35;
            const availableWidth = pageWidth - startXValue - margin;

            const splitText = doc.splitTextToSize(monthsText, availableWidth);
            doc.text(splitText, startXValue, currentY); 
            currentY += (splitText.length - 1) * 4;
      }
      
      const fraisAssocies = Array.isArray(paiement.frais_associes) ? paiement.frais_associes : [];
      console.log('[generateReceipt] fraisAssocies:', fraisAssocies);

      const fraisData = fraisAssocies.map(f => {
        const nom = f.nomfrais || '';
        const montant = safeNumber(f.montant);
        return [f.idfrais || '', nom, `${montant.toLocaleString()} Ar`];
      });

      if (fraisData.length > 0) {
        autoTable(doc, {
          startY: currentY + 10,
          head: [["Code Frais", "Nom du Frais", "Montant (Ar)"]],
          body: fraisData,
          theme: "striped",
          headStyles: { fillColor: [30, 144, 255] },
          margin: { left: margin, right: margin },
          styles: { halign: "center" },
        });
      }

      const afterTableY = doc.lastAutoTable?.finalY || currentY + 30;

      doc.setFont("helvetica", "bold"); doc.setFontSize(13);
      doc.text(`Total Payé : ${safeNumber(paiement.montantpaie).toLocaleString()} Ar`, pageWidth - margin, afterTableY + 10, { align: "right" });

      doc.setFont("helvetica", "normal"); doc.setFontSize(12);
      doc.text(`Reste à payer : ${safeNumber(reste).toLocaleString()} Ar`, pageWidth - margin, afterTableY + 18, { align: "right" });

      doc.setFont("helvetica", "italic"); doc.setFontSize(11);
      doc.text("Signature du comptable :", margin, afterTableY + 30);
      doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.2);
      doc.line(margin + 43, afterTableY + 32, margin + 80, afterTableY + 32);

      doc.setFont("helvetica"); doc.setFontSize(12);
      doc.text("Opération effectuée. Merci pour votre confiance!", pageWidth / 2 , afterTableY + 100, { align: "center" });
      
      doc.save(`${paiement.personne?.nom || 'client'}_${paiement.personne?.prenom || ''}_Reçu_${paiement.no_paie || ''}.pdf`);

    } 
    catch (err) {
      console.error('Erreur generateReceipt:', err);
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de générer le reçu. Vérifier la console.' });
    }
  };

  const generateDailyReceiptsPDF = () => {
    try {
      const today = new Date();
      const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');

      const todaysPayments = listePaie.filter(p => (p.datepaie === todayStr));
      console.log('[generateDailyReceiptsPDF] todayStr=', todayStr, 'found=', todaysPayments.length);

      if (!todaysPayments.length) {
        return Swal.fire({
          icon: 'info',
          title: 'Aucun paiement aujourd\'hui',
          text: "Aucun paiement enregistré aujourd'hui.",
          timer: 1800,
          showConfirmButton: false
        });
      }

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      todaysPayments.forEach((paiement, index) => {
        if (index > 0) doc.addPage();

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        const lineHeight = 8;
        let currentY = 20;

        try 
        {
          const logo = new Image(); logo.src = "/cfp.png"; doc.addImage(logo, "PNG", pageWidth / 2 - 30, 15, 60, 40);
        } 
        catch{ /* ignore */ }

        currentY += 40;
        doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(0,102,204);
        doc.text("Reçu de Paiement", pageWidth / 2, currentY, { align: "center" });

        doc.setFontSize(11); doc.setTextColor(60,60,60);
        doc.text("Établissement Scolaire Laura Vicuna Anjarasoa Ankofafa", pageWidth / 2, currentY + 8, { align: "center" });
        doc.text("Adresse : Ankofafa, Fianarantsoa - Madagascar", pageWidth / 2, currentY + 14, { align: "center" });
        doc.text("Contact : +261 32 439 51 | Adresse-mail: cfplv@gmail.com", pageWidth / 2, currentY + 20, { align: "center" });

        currentY += 35;
        doc.setFontSize(13); doc.setFont("helvetica", "bold");
        doc.text("Détails du Paiement :", margin, currentY);

        currentY += lineHeight;
        doc.setFontSize(12); doc.setFont("helvetica", "normal");
        doc.text(`N° Paiement : ${paiement.no_paie || ''}`, margin, currentY);
        currentY += lineHeight;
        doc.text(`Nom : ${paiement.personne?.nom || ''} ${paiement.personne?.prenom || ''}`, margin, currentY);
        currentY += lineHeight;
        doc.text(`Matricule : ${paiement.matricule || ''}`, margin, currentY);
        doc.text(`Inscription : ${paiement.no_inscrit || ''}`, margin + 100, currentY);
        currentY += lineHeight;
        doc.text(`Date : ${paiement.datepaie || ''}`, margin, currentY);
        doc.text(`Mode : ${paiement.modepaie || ''}`, margin + 100, currentY);

        let monthsText = '';
        if (paiement.nomfraispayés) {
            const matchMonths = paiement.nomfraispayés.match(/\(([^)]+)\)/);
            if (matchMonths && matchMonths[1]) {
                monthsText = matchMonths[1];
            }
        }

        if (monthsText) {
             currentY += lineHeight;
             doc.setFont("helvetica", "bold");
             doc.text(`Mois Payé(s) :`, margin, currentY);
             
             doc.setFont("helvetica", "normal");
             const startXValue = margin + 35;
             const availableWidth = pageWidth - startXValue - margin;

             const splitText = doc.splitTextToSize(monthsText, availableWidth);
             doc.text(splitText, startXValue, currentY); 
             currentY += (splitText.length - 1) * 4;
        }

        const fraisAssocies = Array.isArray(paiement.frais_associes) ? paiement.frais_associes : [];
        const fraisData = fraisAssocies.map(f => [f.idfrais || '', f.nomfrais || '', `${safeNumber(f.montant).toLocaleString()} Ar`]);

        if (fraisData.length) {
          autoTable(doc, {
            startY: currentY + 10,
            head: [["Code Frais","Nom du frais payé(s)","Montant"]],
            body: fraisData,
            theme: "striped",
            headStyles: { fillColor: [30, 144, 255] },
            margin: { left: margin, right: margin },
            styles: { halign: "center" }
          });
        }

        const afterTableY = doc.lastAutoTable?.finalY || currentY + 30;

        doc.setFont("helvetica","bold"); doc.setFontSize(13);
        doc.text(`Total Payé : ${safeNumber(paiement.montantpaie).toLocaleString()} Ar`, pageWidth - margin, afterTableY + 10, { align: "right" });

        let reste = 0;
        try { reste = safeNumber(calculateReste(paiement)); } 
        catch{ reste = 0; }
        doc.setFont("helvetica","normal"); doc.setFontSize(12);
        doc.text(`Reste à payer : ${safeNumber(reste).toLocaleString()} Ar`, pageWidth - margin, afterTableY + 18, { align: "right" });

        doc.setFont("helvetica","italic"); doc.setFontSize(11);
        doc.text("Signature du comptable :", margin, afterTableY + 30);
        doc.setDrawColor(0,0,0); doc.setLineWidth(0.2);
        doc.line(margin + 43, afterTableY + 32, margin + 80, afterTableY + 32);

        doc.setFont("helvetica"); doc.setFontSize(12);
        doc.text("Opération effectuée. Merci pour votre confiance!", pageWidth / 2 , afterTableY + 100, { align: "center" });
      
      });

      doc.save(`Reçus_Aujourd'hui_${todayStr}.pdf`);

      Swal.fire({
        icon: 'success',
        title: 'Reçus générés',
        text: `${todaysPayments.length} reçu(s) généré(s) pour ${todayStr}`,
        timer: 1800,
        showConfirmButton: false
      });

    } catch (err) {
      console.error('Erreur generateDailyReceiptsPDF:', err);
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de générer les reçus. Voir console.' });
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: ""});
  const [appliedDateFilter, setAppliedDateFilter] = useState({ start: "", end: ""});

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const handleDateSearch = () => {
    if(dateRange.start && dateRange.end) {
      setAppliedDateFilter(dateRange);
    }
    else{
      setAppliedDateFilter({ start: "", end:"" })
    }

    setCurrentPage(1);
  }

  const filterPaiements = useMemo(() => {
    let filtered = listePaie;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      filtered = filtered.filter(p => {
        const nomComplet = `${p.personne?.nom || ''} ${p.personne?.prenom || ''}`.toLowerCase();
        
        return (
          String(p.no_paie || '').toLowerCase().includes(q) ||
          String(p.matricule || '').toLowerCase().includes(q) ||
          String(p.no_inscrit || '').toLowerCase().includes(q) ||
          String(p.datepaie || '').toLowerCase().includes(q) ||
          String(p.nomfraispayés || '').toLowerCase().includes(q) || 
          nomComplet.includes(q)
        );
      });
    }
    
    if(appliedDateFilter.start && appliedDateFilter.end){
      const start = new Date(appliedDateFilter.start);
      const end = new Date(appliedDateFilter.end);
      end.setDate(end.getDate() + 1);

      filtered = filtered.filter(p => {
        if(!p.datepaie) return false;
        const date = new Date(p.datepaie);
        return date >= start && date < end; 
      })
    }

    return filtered;
  }, [listePaie, searchQuery, appliedDateFilter]);

  const totalPages = Math.ceil(filterPaiements.length / ITEMS_PER_PAGE);
  const currentData = filterPaiements.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if(page >=1 && page <= totalPages) setCurrentPage(page);
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ p: 3 }}>
        {/* Header avec animation */}
        <motion.div variants={itemVariants}>
          <Box
            sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center', 
              mb: 4, 
              flexWrap: 'wrap', 
              gap: 2,
            }}
          >
            <div className="flex items-center">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <MonetizationOn className="w-8 h-8 mr-3 text-indigo-600" />
              </motion.div>
              <Typography variant="h6" fontWeight="bold">
                Gestion des Paiements au Centre de Formation Professionnelle
              </Typography>
            </div>

            <motion.button 
              whileHover={buttonHover}
              whileTap={buttonTap}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition-all"
              onClick={generateDailyReceiptsPDF}
            >
              <FaFileInvoice className="w-4 h-4" />
              Réçu du Jour
            </motion.button>
          </Box>
        </motion.div>

        {/* Section de recherche avec animation */}
        <motion.div variants={itemVariants}>
          <Box className="p-5 rounded-xl bg-white shadow-md mb-8 border border-indigo-100">
            <div className="flex items-center text-indigo-600 mb-5 border-b pb-3">
              <motion.div whileHover={{ rotate: 15 }}>
                <FaPen className="w-6 h-6 mr-3" />
              </motion.div>
              <h3 className="text-lg font-semibold">
                Technique de recherche des paiements effectués
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  placeholder="Rechercher par matricule, nom, date, etc."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <label className="hidden sm:block text-gray-700 font-medium">Du :</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, start: e.target.value }))
                    }
                    className="border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="hidden sm:block text-gray-700 font-medium">Au :</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <motion.button
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  onClick={handleDateSearch}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  Chercher
                </motion.button>
              </div>
            </div>
          </Box>
        </motion.div>

        <Row>
          {/* Formulaire avec animations */}
          <Col lg={4} className="p-2">
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  bgcolor: 'white',
                }}
              >
                <form onSubmit={handleSubmitPaie}>
                  <div className="flex items-center mb-4">
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <FaMoneyCheckAlt className="w-6 h-6 mr-3 text-indigo-600" />
                    </motion.div>
                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                      Formulaire de Paiement
                    </Typography>
                  </div>

                  <motion.div variants={containerVariants}>
                    <Row>
                      {[
                        { lg: 6, field: (
                          <TextField
                            fullWidth
                            label="No. Paiement"
                            name="no_paie"
                            value={paymentDetails.no_paie || ''}
                            onChange={(e) => updatePayment({ no_paie: e.target.value })}
                            size="small"
                            disabled
                            required
                          />
                        )},
                        { lg: 6, field: (
                          <TextField
                            select
                            fullWidth
                            label="No. Matricule"
                            name="matricule"
                            value={paymentDetails.matricule}
                            onChange={(e) =>
                              updatePayment({ matricule: e.target.value, no_inscrit: '' })
                            }
                            size="small"
                            required
                          >
                            {[...new Set(listeInsc.map((i) => i.matricule))].map((mat) => (
                              <MenuItem key={mat} value={mat}>
                                {mat}
                              </MenuItem>
                            ))}
                          </TextField>
                        )},
                        { lg: 6, field: (
                          <TextField
                            select
                            fullWidth
                            label="No. Inscription"
                            name="no_inscrit"
                            value={paymentDetails.no_inscrit}
                            onChange={(e) => updatePayment({ no_inscrit: e.target.value })}
                            size="small"
                            disabled={!paymentDetails.matricule}
                            required
                          >
                            {listeInsc
                              .filter((i) => i.matricule === paymentDetails.matricule)
                              .map((insc) => (
                                <MenuItem key={insc.no_inscrit} value={insc.no_inscrit}>
                                  {insc.no_inscrit}
                                </MenuItem>
                              ))}
                          </TextField>
                        )},
                        { lg: 6, field: (
                          <TextField
                            fullWidth
                            label="Date de paiement"
                            type="date"
                            value={paymentDetails.datepaie}
                            onChange={(e) => updatePayment({ datepaie: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            required
                          />
                        )},
                        { lg: 6, field: (
                          <TextField
                            fullWidth
                            label="Montant à payer (Ar)"
                            type="number"
                            value={paymentDetails.montantpaie}
                            size="small"
                            onChange={(e) => {
                              const montant = Number(e.target.value);
                              setPaymentDetails((prev) => ({
                                ...prev,
                                montantpaie: montant,
                                reste: calculateResteSafe({
                                  ...prev,
                                  montantpaie: montant,
                                }),
                              }));
                            }}
                          />
                        )},
                        { lg: 6, field: (
                          <TextField
                            select
                            fullWidth
                            label="Mode de paiement"
                            value={paymentDetails.modepaie}
                            onChange={(e) => updatePayment({ modepaie: e.target.value })}
                            size="small"
                            required
                          >
                            <MenuItem value="Espèce">Espèce</MenuItem>
                            <MenuItem value="Chèque">Chèque</MenuItem>
                            <MenuItem value="Virement">Virement</MenuItem>
                          </TextField>
                        )}
                      ].map((col, index) => (
                        <Col key={index} lg={col.lg} className="mb-3">
                          <motion.div variants={itemVariants}>
                            {col.field}
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </motion.div>

                  <Divider sx={{ my: 3 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 500, textAlign: 'center' }}
                  >
                    Sélection du / des Frais à Payer
                  </Typography>

                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <Form.Select
                      multiple
                      value={paymentDetails.nomFrais}
                      onChange={handleFraisChange}
                      className="rounded-md border-indigo-300"
                    >
                      {listeFrais.map((f) => (
                        <option key={f.idfrais} value={f.nomfrais}>
                          {f.nomfrais}
                        </option>
                      ))}
                    </Form.Select>
                  </motion.div>

                  {paymentDetails.nomFrais.some((f) => f.includes('Ecolage')) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          mt: 3,
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          p: 2,
                          bgcolor: 'gray.50',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}
                        >
                          Mois à payer :
                        </Typography>
                        <Box
                          sx={{
                            mt: 2,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 1,
                          }}
                        >
                          {monthOptions.map((month, i) => (
                            <motion.div
                              key={i}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={paymentDetails.tuitionMonths.includes(month)}
                                    onChange={() => handleTuitionMonthCheck(month)}
                                  />
                                }
                                label={month}
                              />
                            </motion.div>
                          ))}
                        </Box>
                      </Box>
                    </motion.div>
                  )}

                  <Divider sx={{ my: 4 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                      <Button
                        variant="contained"
                        sx={buttonStyle('#f44336')}
                        startIcon={<FaTimes />}
                        onClick={resetForm}
                      >
                        Annuler
                      </Button>
                    </motion.div>
                    <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                      <Button
                        variant="contained"
                        type="submit"
                        sx={buttonStyle('#4CAF50')}
                        startIcon={<FaMoneyCheckAlt />}
                      >
                        Payer
                      </Button>
                    </motion.div>
                  </Box>
                </form>
              </Box>
            </motion.div>
          </Col>

          {/* Tableau avec animations */}
          <Col lg={8} className="p-2">
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: 'white',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: 'indigo.700', fontWeight: 600 }}>
                  Liste des Paiements
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 10, borderRadius: 1, height: '750px', overflow: 'auto', }}>
                  <MuiTable stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead>
                      <TableRow sx={{ position: 'sticky', top: 0, zIndex: 2, bgcolor: 'primary.main',}}>
                        {tableHeaders.map((col) => (
                          <TableCell key={col.title} sx={{ color: 'white', fontWeight: 600, textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.3)', backgroundColor: 'primary.main', width: col.width,
                              whiteSpace:col.title === 'Frais Payés' ? 'normal' : 'nowrap',
                              wordWrap:col.title === 'Frais Payés' ? 'break-word' : 'normal',}}>
                            {col.title}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <AnimatePresence>
                        {currentData.length > 0 ? (
                          currentData.map((liste, index) => (
                            <motion.tr
                              key={liste.no_paie}
                              variants={tableRowVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              custom={index}
                              whileHover={{ backgroundColor: '#f5f5f5' }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <TableCell sx={{textAlign:'center'}} >{liste.no_paie}</TableCell>
                              <TableCell sx={{textAlign:'center'}} >{liste.matricule}</TableCell>
                              <TableCell sx={{textAlign:'center'}} >{liste.no_inscrit}</TableCell>
                              <TableCell sx={{textAlign:'center'}}>
                                <b>{liste.personne?.nom}</b> {liste.personne?.prenom}
                              </TableCell>
                              <TableCell sx={{textAlign:'center'}}>{liste.datepaie}</TableCell>
                              <TableCell sx={{textAlign:'center'}}>{liste.montantpaie}</TableCell>
                              <TableCell sx={{ color: calculateResteSafe(liste) > 0 ? 'red' : 'green', fontWeight: 'bold' }}>
                                {calculateResteSafe(liste).toLocaleString()} Ar
                              </TableCell>
                              <TableCell sx={{textAlign: 'center'}}>{liste.modepaie}</TableCell>
                              <TableCell sx={{ whiteSpace: 'normal', wordWrap: 'break-word',}}>
                                {liste.nomfraispayés || (
                                  Array.isArray(liste.frais_associes) &&
                                  liste.frais_associes.length > 0
                                    ? liste.frais_associes.map((f) => f.nomfrais).join(', ')
                                    : 'Aucune'
                                )}
                              </TableCell>
                              <TableCell>
                                <Box sx={{display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap',}}>
                                  {[
                                    { icon: FaEdit, label: 'Modifier', color: 'indigo', action: () => handleSelectedPaie(liste) },
                                    { icon: FaTrash, label: 'Supprimer', color: 'red', action: () => handleDeletePaie(liste.no_paie) },
                                    { icon: FaFileInvoice, label: 'Facture', color: 'green', action: () => generateReceipt(liste) },
                                    { icon: FaIdCard, label: 'Voir Carte', color: 'indigo', action: () => openCarte(liste.matricule) }
                                  ].map((btn, btnIndex) => (
                                    <motion.button
                                      key={btnIndex}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className={`flex items-center text-white bg-${btn.color}-600 text-white p-2 rounded`}
                                      onClick={btn.action}
                                    >
                                      <btn.icon className='mx-1'/>{btn.label}
                                    </motion.button>
                                  ))}
                                </Box>
                              </TableCell>
                            </motion.tr>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Typography variant="h6">
                                  Aucun paiement trouvé pour cette recherche.
                                </Typography>
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        )}
                      </AnimatePresence>
                    </TableBody>
                  </MuiTable>
                </TableContainer>
              </Box>
            </motion.div>

            {/* Pagination avec animation */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t mt-4">
                  <motion.button 
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    onClick={() => goToPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-3 py-1 bg-indigo-800 text-white fw-bold border rounded-lg text-gray-700 hover:bg-blue-100 disabled:opacity-50"
                  >
                    Précédent
                  </motion.button>
                  <span className="text-sm text-gray-600">Page {currentPage} sur {totalPages}</span>
                  <motion.button 
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    onClick={() => goToPage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-3 py-1 bg-indigo-800 text-white fw-bold border rounded-lg text-gray-700 hover:bg-blue-100 disabled:opacity-50"
                  >
                    Suivant
                  </motion.button>
                </div>
              </motion.div>
            )}
          </Col>
        </Row>

        {/* Modal avec animation */}
        <AnimatePresence>
          {modalPaie && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dialog open={modalPaie} onClose={closeModal}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <DialogTitle>Modification de Paiement</DialogTitle>
                  <form onSubmit={handleEditPaie}>
                    <DialogContent>
                      <TextField fullWidth label="No. Matricule" value={paymentDetails.matricule} size="small" sx={{ mb: 3 }} disabled InputProps={{ readOnly: true }} />
                      <TextField type="date" label="Date de Paiement" value={paymentDetails.datepaie} onChange={e => updatePayment({ datepaie: e.target.value })} fullWidth sx={{ mb: 3 }} InputLabelProps={{ shrink: true }} required/>

                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>Sélection du / des Frais à Modifier</Typography>
                      <Form.Select multiple value={paymentDetails.nomFrais} onChange={handleFraisChange} style={{ marginBottom: 10 }}>
                        {listeFrais.map(f => <option key={f.idfrais} value={f.nomfrais}>{f.nomfrais}</option>)}
                      </Form.Select>

                      {paymentDetails.nomFrais.some(f => f.includes('Ecolage')) && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>Mois à payer :</Typography>
                          <Box sx={{mt: 2, display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)',gap: 1}}>
                            {monthOptions.map((month, i) => (
                              <FormControlLabel 
                                key={i} control={
                                  <Checkbox checked={paymentDetails.tuitionMonths.includes(month)}
                                    onChange={() => handleTuitionMonthCheck(month)} 
                                  />} 
                                label={month} 
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      <TextField fullWidth label="Montant à payer (Ar)" type="number" value={paymentDetails.montantpaie} size="small"
                        onChange={(e) => { 
                          const montant = safeNumber(e.target.value);
                          setPaymentDetails(prev => ({
                              ...prev,
                              montantpaie: montant,
                          }));
                        }}/>

                      <TextField select fullWidth label="Mode de Paiement" value={paymentDetails.modepaie} onChange={e => updatePayment({ modepaie: e.target.value })} sx={{ mt: 3 }}>
                        <MenuItem value="Espèce">Espèce</MenuItem>
                        <MenuItem value="Chèque">Chèque</MenuItem>
                        <MenuItem value="Virement">Virement</MenuItem>
                      </TextField>
                    </DialogContent>

                    <DialogActions>
                      <Button onClick={closeModal} variant='contained' color="error" sx={{textTransform: 'none'}} >Annuler</Button>
                      <Button type="submit" variant="contained" sx={{textTransform: 'none'}} color="primary">Enregistrer</Button>
                    </DialogActions>
                  </form>
                </motion.div>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>

        <CarteEcolage matricule={selectedMatricule} open={modalCarteOpen} handleClose={closeCarte} />
      </Box>
    </motion.div>
  );
}

export default PaymentPage;