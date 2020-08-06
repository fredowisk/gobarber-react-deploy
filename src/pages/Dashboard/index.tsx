import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, isAfter, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
// importando a lib que pega a data selecionada
import DayPicker, { DayModifiers } from 'react-day-picker';
// importando os estilos da data
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment,
} from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface AppointmentItem {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  // importando o auth para pegar o id do user
  const { signOut, user } = useAuth();
  // date para selecionar datas, iniciando ele com a data de hoje.
  const [selectedDate, setSelectedDate] = useState(new Date());
  // estado que irá armazenar o mês atual
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // estado para ver se o mês está disponível
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  // estado dos appointments que serão listados
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  // função que será disparada quando o usuário clicar em algum dia da semana
  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    // se o dia estiver disponivel
    if (modifiers.available && !modifiers.disabled) {
      // não permita selecionar dias indisponíveis
      // selecione este dia
      setSelectedDate(day);
    } // a dependencia vazia, significa que essa função será carregada apenas uma vez
  }, []);

  // função para mudar o mês
  const handleMonthChange = useCallback(
    (month: Date) => {
      setCurrentMonth(month);
    }, // a dependencia vazia, significa que essa função será carregada apenas uma vez
    [],
  );

  // o useEffect atualiza toda vez que uma variável muda seu valor
  useEffect(() => {
    // mandando o id do usuário para a rota
    api
      .get(`/providers/${user.id}/month-availability`, {
        // pegando os query params
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      }); // dependências
  }, [currentMonth, user.id]);

  // useEffect para carregar os agendamentos
  useEffect(() => {
    // mandando o id do usuário para a rota
    api
      .get<AppointmentItem[]>('appointments/me', {
        // pegando os query params
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        // mapeando para cada appointment, receba todos os appointments e formate a hora
        const appointmentsFormatted = response.data.map(appointment => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
          };
        });
        // dados que vieram da API
        setAppointments(appointmentsFormatted);
      }); // dependências
  }, [selectedDate]);

  // o use memo memoriza um valor específico, ex: uma formatação
  const disabledDays = useMemo(() => {
    // filtrando os dias do mês, se ele não estiver disponivel
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  // função que irá transformar as datas em texto
  const selectedDateAsText = useMemo(() => {
    // formatando a data selecionada, tudo que estiver entre '' não irá aparecer
    return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    // transformando o dia da semana em nome do dia, ex: segunda-feira
    return format(selectedDate, "cccc'-feira'", { locale: ptBR });
  }, [selectedDate]);

  // agendamentos da manhã
  const morningAppointments = useMemo(() => {
    // filtre cada appointment e converta a data para date, e verifique se a hora é
    // menor do que 12
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  // agendamentos da tarde
  const afternoonAppointments = useMemo(() => {
    // filtre cada appointment e converta a data para date, e verifique se a hora é
    // maior ou igual a 12
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  // pegando o primeiro appointment que a data seja depois de agora
  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem-vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>
          {/* Botão de perfil */}
          <Link to="/profile">
            <FiUser />
          </Link>
          {/* quando o botão for pressionado o usuário irá deslogar */}
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        {/* cronograma de compromissos/agendamentos */}
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {/* Apenas mostre o span, se for HOJE */}
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>
          {/* agendamento a seguir, próximo a ser atendido
          Se for hoje... */}
          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <span>Você não possui agendamentos neste período</span>
            )}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <span>Você não possui agendamentos neste período</span>
            )}

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        {/* Calendário */}
        <Calendar>
          {/* Lib que pega a data selecionada */}
          <DayPicker
            // colocando a letra inicial dos dias da semana
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            // Ele não vai nos permitir selecionar meses que já passaram
            fromMonth={new Date()}
            // desabilitando dias da semana, domingo é 0 e sabado é 6
            // utilizando o ... pois ele não aceitaria um array dentro de outro array
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            // mostrando os dias que estão disponíveis
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            // selecionando o mês
            onMonthChange={handleMonthChange}
            // selecionando o dia
            selectedDays={selectedDate}
            // caso o usuário clicar em algum dia da semana
            onDayClick={handleDateChange}
            // meses
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
